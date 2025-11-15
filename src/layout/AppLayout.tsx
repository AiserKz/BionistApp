import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export function AppLayout() {
  return (
    <div className="min-h-screen w-full text-gray-300 flex justify-center p-4 overflow-hidden relative font-sans bg-zinc-900">
      <div
        className="absolute inset-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] 
      bg-size-[24px_24px] 
      mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      ></div>
      <div className="w-full max-w-5xl mx-auto z-10 p-4 sm:p-6 md:p-8">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
