"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Tutorial() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-[#333] font-sans flex flex-col">
      <header className="bg-[#1a1a1a] text-white py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-2xl font-bold text-[#00d2ff]">
          Ekin AI Studio
        </Link>
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          &#9776;
        </button>
        <ul
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row absolute md:static top-full left-0 w-full md:w-auto bg-[#1a1a1a] md:bg-transparent items-center gap-6 py-4 md:py-0 transition-all`}
        >
          <li>
            <Link href="/" className="hover:text-[#00d2ff] transition" onClick={() => setMenuOpen(false)}>
              Beranda
            </Link>
          </li>
          <li>
            <Link href="/tutorial" className="hover:text-[#00d2ff] transition text-[#00d2ff]" onClick={() => setMenuOpen(false)}>
              Tutorial
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-[#00d2ff] transition" onClick={() => setMenuOpen(false)}>
              Tentang
            </Link>
          </li>
        </ul>
      </header>

      <main className="w-full max-w-4xl mx-auto my-8 p-6 md:p-8 bg-white rounded-lg shadow-md flex-grow">
        <h1 className="text-3xl font-extrabold text-[#222] mb-6 text-center">
          Tutorial Membuat Web Generator AI dengan Domain Sendiri Bagi Pemula
        </h1>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-700 mb-2">1. Buat Kode Generator AI dengan Gemini</h2>
          <p className="mb-2">
            Langkah pertama mari kita buat Web Generator AI dengan HTML keseluruhan include CSS dan Javascript, atau mau buat terpisah itu tergantung kebutuhan sendiri. Disini untuk kita pemula biar secara keseluruhan saja ya dalam satu html.
          </p>
          <p className="mb-4">Pertama kita ke Gemini dan instruksikan untuk membuat Web Generator AI dengan API Key Pollinations. Contoh prompt-nya:</p>
          <div className="bg-[#2d2d2d] text-[#00ffcc] p-4 rounded-md font-mono overflow-x-auto text-sm leading-relaxed">
            Buatkan generator gambar AI menggunakan parameter Text-to-image berikut ini:<br />
            Base URL: https://gen.pollinations.ai<br />
            Get your API key: enter.pollinations.ai<br />
            https://enter.pollinations.ai/<br />
            modern, responsif dan lengkap dalam satu keseluruhan dalam bentuk html.<br />
            Tambahkan fitur model, Style dan aspek rasio lengkap.
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-700 mb-2">2. Simpan dan Uji Coba HTML</h2>
          <p>
            Setelah selesai copas htmlnya, simpan dengan nama <strong>index.html</strong> dan test, apakah bisa berjalan atau masih gagal. Jika ada yang kurang silahkan lampirkan filenya atau perintah kembali ke Gemini.
          </p>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-700 mb-2">3. Beli Domain</h2>
          <p>
            Jika sudah dianggap bisa menghasilkan gambar, selanjutnya kita harus beli domain di <a href="https://beli.idwebhost.com/promo-domainid/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">IDWebhost Promo Domain</a>.
          </p>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-700 mb-2">4. Persiapan Akun GitHub</h2>
          <p>
            Setelah aktif pilihan domainnya, lalu ke GitHub buat akun dan pastikan saat login di GitHub userID jangan ada huruf besar, semua harus huruf kecil.
          </p>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-700 mb-2">5. Buat Repository GitHub</h2>
          <p>
            Setelah login berhasil di GitHub, lanjut create repository, buat nama dengan huruf kecil semua. Kalau bisa disamakan dengan userID, contoh: <code>ekin-github-io</code>.
          </p>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-700 mb-2">6. Upload File HTML ke GitHub</h2>
          <p>
            Setelah itu create new file bagian bawah, copy paste semua kode html yg sudah kita simpan di notepad, lalu beri nama <strong>index.html</strong> di bagian atas. Sampai disini selesai di GitHub.
          </p>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-700 mb-2">7. Deploy ke Vercel</h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Buat Akun Vercel:</strong> Pergi ke vercel.com dan daftar menggunakan akun GitHub kamu untuk mempermudah proses.</li>
            <li><strong>Import Proyek dari Git:</strong> Setelah login ke dashboard Vercel, klik &quot;Add New...&quot; &gt; &quot;Project&quot;. Berikan izin akses GitHub, pilih repositori kamu, lalu klik &quot;Import&quot;.</li>
            <li><strong>Konfigurasi Deploy:</strong> Vercel akan otomatis mendeteksi proyek. Klik &quot;Deploy&quot;.</li>
          </ul>
          <p>Selesai! Vercel akan mulai membangun (build) aplikasi kamu. Setelah selesai, klik URL unik yang diberikan untuk melihat generator gambar kamu yang sudah live!</p>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-700 mb-2">8. Daftarkan Domain di Vercel</h2>
          <p className="mb-2">Beritahu Vercel alamat domain baru kamu:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Buka dashboard Vercel, masuk ke proyek web kamu, klik menu <strong>Settings</strong> &gt; <strong>Domains</strong>.</li>
            <li>Ketik nama domain kamu (misalnya: <code>ekin-ai-studio.my.id</code>), lalu klik <strong>Add</strong>.</li>
          </ul>
          <p>
            <strong>Dapatkan Alamat Nameserver Vercel:</strong> Jika muncul pesan <em>Invalid Configuration</em>, pilih opsi Nameservers. Vercel akan menampilkan dua alamat standar:<br />
            <code>ns1.vercel-dns.com</code><br />
            <code>ns2.vercel-dns.com</code>
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-700 mb-2">9. Ubah Nameserver di Panel IDWebhost</h2>
          <p className="mb-2">Sekarang masukkan kedua alamat tersebut ke IDWebhost:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Login ke Member Area IDWebhost &gt; <strong>Domain</strong> &gt; <strong>Domain Saya</strong>.</li>
            <li>Cari domain kamu, klik ikon Manage/Kelola (Obeng/Tang).</li>
            <li>Klik menu <strong>Nameservers</strong> di sebelah kiri. Pilih opsi <em>Gunakan custom nameservers</em>.</li>
            <li>Ganti nameserver bawaan dengan milik Vercel:<br />
              Nameserver 1: <code>ns1.vercel-dns.com</code><br />
              Nameserver 2: <code>ns2.vercel-dns.com</code>
            </li>
            <li>Klik tombol <strong>Ubah Nameserver</strong>.</li>
          </ul>
          <p className="bg-blue-50 border-l-4 border-blue-500 p-4 text-sm mt-4">
            <strong>Tahap Menunggu Propagasi:</strong> Perubahan ini membutuhkan waktu agar dikenali internet global (bisa beberapa menit hingga 24 jam). Biarkan halaman Domains di Vercel terbuka, statusnya akan otomatis menjadi centang biru (Valid Configuration) jika sudah terdeteksi.
          </p>
        </div>
      </main>

      <footer className="bg-[#1a1a1a] text-[#aaa] text-center p-6 mt-auto">
        <p>&copy; 2026 Ekin AI Studio - Tutorial Web Development</p>
        <p className="text-sm mt-2 opacity-75">React/Next.js Conversion by Antigravity</p>
      </footer>
    </div>
  );
}
