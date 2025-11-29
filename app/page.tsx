import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black px-6">
      <main className="flex w-full max-w-md flex-col items-center gap-10 py-16">
        
        {/* LOGO */}
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/logo.png" 
            alt="TaskEase Logo"
            width={80}
            height={80}
            className="rounded-xl"
          />
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
            TaskEase
          </h1>
        </div>

        {/* DESKRIPSI */}
        <p className="text-center text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          TaskEase adalah aplikasi mobile sederhana untuk mengatur aktivitas
          harian secara terstruktur. Kelola tugas, tandai selesai, dan jaga
          produktivitas setiap hari.
        </p>

        {/* CTA BUTTON */}
        <a
          href="/tasks"
          className="w-full text-center rounded-full bg-black text-white py-3 text-lg font-medium tracking-wide dark:bg-white dark:text-black hover:opacity-90"
        >
          Mulai Kelola Tugas
        </a>

      </main>
    </div>
  );
}
