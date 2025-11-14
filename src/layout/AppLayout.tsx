import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import Aurora from "../components/Aurora";

export function AppLayout() {
  return (
    <div className="min-h-screen  transition-colors duration-300">
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
        <div className="absolute inset-0 flex justify-center items-center -z-10 pointer-events-none">
          <Aurora
            speed={0.5}
            blend={0.8}
            colorStops={["#7BC47F", "#A8D9A3", "#E07A5F", "#FFD8B0", "#FFF4DC"]}
          />
        </div>
        <div className="flex flex-col max-w-[960px] flex-1">
          <Header />
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
