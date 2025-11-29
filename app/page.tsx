import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black px-6">
      <main className="flex w-full max-w-md flex-col items-center gap-10 py-16">

        {/* LOGO */}
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/images/contoh_logo.png"
            alt="TaskEase Logo"
            width={90}
            height={90}
            className="rounded-xl"
            priority
          />
          <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">
            TaskEase
          </h1>
        </div>

        {/* DESKRIPSI */}
        <p className="text-center text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed max-w-sm">
          TaskEase membantu kamu mengatur aktivitas harian dengan lebih mudah dan
          terstruktur. Buat daftar tugas, tandai yang sudah selesai, dan
          tingkatkan produktivitas setiap hari.
        </p>

        {/* CTA BUTTON */}
        <Link
          href="/login"
          className="w-full text-center rounded-full bg-black text-white py-3 text-lg font-medium tracking-wide dark:bg-white dark:text-black hover:opacity-90 transition"
        >
          Mulai Kelola Tugas
        </Link>

      </main>
    </div>
  );
}
