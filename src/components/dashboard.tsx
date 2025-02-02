import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import airFlow from "../assets/airFlow.json";
import Nozzle from "../assets/svg/nozzle";

interface Nozzle {
  id: string;
  isVacActive?: boolean;
  isPicking?: boolean;
  isPlacing?: boolean;
  hasComponent?: boolean;
}

interface Status {
  done: number;
  total: number;
  nozzles: Nozzle[];
  state?: string;
}

const Dashboard: React.FC = () => {
  const [status, setStatus] = useState<Status>({
    done: 0,
    total: 0,
    nozzles: [{ id: "N1" }, { id: "N2" }],
  });

  useEffect(() => {
    const handleStatusUpdate = (_event: any, newStatus: Status) => {
      console.log("update:", newStatus);
      setStatus(newStatus);
    };

    window.ipcRenderer.on("machine-status-updated", handleStatusUpdate);

    return () => {
      window.ipcRenderer.off("machine-status-updated", handleStatusUpdate);
    };
  }, []);

  const progress =
    status.total === 0
      ? 0
      : parseInt(((status.done / status.total) * 100).toString());

  return (
    <div className="flex w-screen h-screen bg-slate-900 overflow-hidden">
      {/* Background effect container */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`
            absolute inset-0 transition-all duration-500 ring-[10vw] mix-blend-hard-light animate-pulse blur-[4vw]
            ${
              !["ERROR", "COMPLETED"].includes(status.state ?? "")
                ? "ring-transparent scale-150 origin-center"
                : ""
            }
            ${status.state === "ERROR" ? "ring-red-300" : ""}
            ${status.state === "COMPLETED" ? "ring-green-300" : ""}
          `}
        />
      </div>

      <div className="z-10 p-[5%] flex w-1/2 justify-center items-center">
        <div className="aspect-square w-full max-h-full">
          <div className="relative w-full h-full">
            {/* Background Circle */}
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                className="stroke-sky-950"
                strokeWidth="4"
              />
            </svg>
            {/* Progress Circle */}
            <svg
              className="w-full h-full absolute top-0 left-0"
              viewBox="0 0 36 36"
            >
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                className="stroke-sky-500 transition-all duration-350"
                strokeWidth="4"
                strokeDasharray="100"
                strokeDashoffset={100 - progress}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
                style={{
                  transformOrigin: "center",
                }}
              />
            </svg>
            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="font-bold text-gray-100"
                style={{ fontSize: `clamp(0.5rem, 10vw, 15vh)` }}
              >
                {progress}%
              </div>
              <div
                className="absolute top-[60%] text-gray-300 mt-1"
                style={{ fontSize: `clamp(0.25rem, 2vw, 8vh)` }}
              >
                {status.done} / {status.total}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="z-10 p-[5%] w-1/2 flex">
        {status.nozzles.map((nozzle) => (
          <div
            key={nozzle.id}
            className="gap-x-2 gap-y-4 flex flex-col justify-around items-center w-full"
          >
            <span
              className="text-gray-300"
              style={{ fontSize: `clamp(0.25rem, 4vw, 8vh)` }}
            >
              {nozzle.id}
            </span>
            <div
              className={`h-3/5 relative ${
                nozzle.isPicking || nozzle.isPlacing
                  ? "motion-translate-y-loop-[15%] motion-loop-once"
                  : ""
              }`}
            >
              <Nozzle className="h-full" />
              {nozzle.isVacActive && (
                <div className="absolute inset-0 transition-opacity">
                  <Lottie animationData={airFlow} className="size-full" />
                </div>
              )}
              <div
                className={`motion-delay-200 motion-duration-200 mx-auto w-1/3 h-[4%] border-2 border-white ${
                  nozzle.hasComponent
                    ? "motion-opacity-in-0"
                    : "motion-opacity-out-0"
                }`}
              />
            </div>
            <div className="mt-10 z-50 w-1/4 relative">
              {nozzle.isVacActive && (
                <div className="w-full aspect-2/1 z-0 bg-sky-500 animate-ping rounded-lg absolute" />
              )}
              <div
                className={`transition-colors z-50 w-full aspect-2/1 rounded-lg ${
                  nozzle.isVacActive ? "bg-sky-500" : "bg-sky-950"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
