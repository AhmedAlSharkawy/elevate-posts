import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[url('/images/background.jpg')] bg-cover bg-fixed bg-center px-4 py-4 sm:px-8">
      <div className="mx-auto flex max-w-300 flex-col gap-6">
        <header className="flex flex-col items-center gap-1 rounded-xl bg-slate-400/90 px-6 py-5 text-white shadow-sm backdrop-blur-md md:relative md:flex-row md:justify-center">
          <Link
            to="/"
            className="font-semibold md:absolute md:left-6 md:text-xl"
          >
            Elevate
          </Link>
          <h1 className="text-center text-lg font-semibold md:text-2xl">
            Frontend Advanced Bootcamp Task
          </h1>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
