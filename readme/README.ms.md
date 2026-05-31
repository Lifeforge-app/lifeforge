> [!NOTE]
> Jangan risau, LifeForge masih aktif dibangunkan. Kemajuan terkini boleh didapati [di sini](https://github.com/Lifeforge-app/lifeforge/tree/features/forge-ui-overhaul).
> ### Kemas Kini 31 Mei 2026
> Pembinaan semula pustaka UI dan migrasi kod teras klien daripada Tailwind telah selesai. Yang tinggal hanyalah memigrasi semua modul.

> [!CAUTION]
>
> ## ⚠️ Pembangunan Ditangguh – Isu Kritikal Seni Bina CSS
>
> **Kemajuan keseluruhan sistem terpaksa dihentikan buat sementara** disebabkan konflik lapisan CSS yang teruk antara aplikasi hos dan modul persekutuan.
>
> **Punca Masalah:** Apabila hos dan modul persekutuan masing-masing membungkus Tailwind CSS secara berasingan, konflik lapisan kaskad CSS berlaku. Ini menyebabkan penggantian gaya yang tidak dapat diramal merentasi sempadan modul, memecahkan utiliti responsif (contohnya `flex md:grid`) dan menyebabkan gaya modul mengatasi gaya hos secara tidak sengaja. Isu ini adalah sifat semula jadi CSS global berasaskan utiliti dalam persekitaran persekutuan modul dan tidak dapat diselesaikan dengan konfigurasi semata-mata.
>
> **Arah Penyelesaian:**
> PR **#93** memperkenalkan versi dipertingkatkan pustaka UI dalaman yang bertujuan **menggantikan Tailwind sepenuhnya**. Sistem baharu ini berasaskan token, berkomponen, dan mengelakkan CSS utiliti global, menghapuskan konflik lapisan rentas sempadan secara reka bentuk. Perubahan ini mewujudkan kontrak gaya yang seragam dan boleh diramal merentasi hos dan semua modul persekutuan.
>
> **Penting:**
> Migrasi ini melibatkan **perubahan pecah** dan merupakan peralihan seni bina yang dirancang. Walaupun mengganggu dalam jangka pendek, ia diperlukan untuk memastikan kestabilan dan ketepatan jangka panjang sistem persekutuan modul. Sila rujuk [isu ini](https://github.com/lifeforge-app/lifeforge/issues/93) untuk kemas kini dan butiran migrasi.

<div align="center">
<img src="https://raw.githubusercontent.com/LifeForge-app/lifeforge-docs-media/main/assets/lifeforge-logo.svg" alt="LifeForge Logo" width="240" height="80"/>
</div>

<p align="center">Penyelesaian yang dihoskan sendiri untuk menstruktur dan menyusun semua aspek kehidupan anda.</p>

![LifeForge Interface Mockup](https://raw.githubusercontent.com/LifeForge-app/lifeforge-docs-media/main/assets/mockup-new.webp)

<div align="center">

![skills](https://img.shields.io/badge/-TYPESCRIPT-FF0000?style=for-the-badge&logo=typescript&logoColor=white&color=3178C6)
![skills](https://img.shields.io/badge/-HTML-FF0000?style=for-the-badge&logo=html5&logoColor=white&color=orange)
![skills](https://img.shields.io/badge/-CSS-FF0000?style=for-the-badge&logo=css3&logoColor=white&color=blue)
![skills](https://img.shields.io/badge/-REACT_JS-FF0000?style=for-the-badge&logo=react&logoColor=white&color=skyblue)
![skills](https://img.shields.io/badge/-NODE_JS-FF0000?style=for-the-badge&logo=node.js&logoColor=white&color=green)
![skills](https://img.shields.io/badge/-EXPRESS_JS-FF0000?style=for-the-badge&logo=express&logoColor=white&color=black)
![skills](https://img.shields.io/badge/-POCKETBASE-FF0000?style=for-the-badge&logo=pocketbase&logoColor=black&color=white)

</div>

<h3 align="center">
	PROJEK INI MASIH DALAM PEMBANGUNAN AWAL. STURKTUR SISTEM & MODUL MUNGKIN BERUBAH. SILA SEMAK <a href="https://docs.lifeforge.dev/progress/changelog">DOKUMENTASI</a> UNTUK STATUS TERKINI.
</h3>

## 📋 Kandungan

- [📋 Kandungan](#-kandungan)
- [🔥 Sokong Pengarang](#-sokong-pengarang)
- [🤔 Masalah](#-masalah)
- [✅ Penyelesaian](#-penyelesaian)
- [🧱 Modul](#-modul)
- [🖥 Tangkapan Skrin](#-tangkapan-skrin)
- [⌨️ Pemasangan](#️-pemasangan)
- [Sumbangan](#sumbangan)
	- [Sumbangan kepada Teras](#sumbangan-kepada-teras)
	- [Mencipta Modul](#mencipta-modul)
	- [Permintaan Ciri \& Laporan Bug](#permintaan-ciri--laporan-bug)
	- [Terjemahan](#terjemahan)
- [💡 Kredit](#-kredit)
- [📄 Lesen](#-lesen)

<div align="center">
<a href="../README.md">🇬🇧 English</a>
<a href="README.zh-CN.md">🇨🇳 简体中文</a>
<a href="README.zh-TW.md">🇹🇼 繁體中文</a>
<a href="README.ms.md">🇲🇾 Bahasa Malaysia</a>
</div>

## 🔥 Sokong Pengarang

<a href="https://www.buymeacoffee.com/melvinchiah" target="_blank">
	<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="60" width="217">
</a>

## 🤔 Masalah

Orang kini menggunakan banyak aplikasi untuk meningkatkan produktiviti, tetapi penggunaan terlalu banyak aplikasi boleh mengalih perhatian dan mengurangkan fokus (rujuk: https://theunfilteredreport.com/why-productivity-apps-are-making-people-less-productive/).

Kebanyakan perkhidmatan SaaS memerlukan langganan bulanan (atau tahunan), yang boleh menjadi kos berulang. Selain itu, banyak perkhidmatan mengumpulkan data pengguna untuk pengiklanan, dan mungkin menggunakan data itu untuk latihan AI, menimbulkan kebimbangan privasi.

## ✅ Penyelesaian

LifeForge ialah sistem pengurusan peribadi yang dihoskan sendiri untuk membantu anda mengatur kehidupan. Sama ada menjejak tugas, mengatur projek, menetapkan matlamat peribadi, atau mengurus kewangan - LifeForge membantu.

Dengan seni bina modular, anda boleh menyesuaikan LifeForge mengikut keperluan. Hidupkan hanya modul yang anda perlukan untuk mengelakkan kekacauan ciri dan mencipta pengalaman yang ringkas dan diperibadikan.

Dibina dengan fokus privasi, data anda disimpan secara tempatan pada peranti anda (kami tidak akan menyediakan hosting), jadi anda mengekalkan kawalan penuh terhadap data sendiri. Tiada telemetri, tiada perlombongan data - privasi didahulukan.

## 🧱 Modul

Sistem modul LifeForge menyediakan pelbagai modul yang tertumpu kepada aspek kehidupan seperti produktiviti, kewangan, gaya hidup dan pembelajaran. Setiap modul menawarkan fleksibiliti dan penyesuaian untuk membantu anda menguruskan tugas, kewangan atau usaha kreatif sambil mengaktifkan hanya apa yang diperlukan.

Sorotan utama modul termasuk:

- Alat Produktiviti: Senarai Tugasan, Projek, Idea Box, Pemasa Pomodoro - alat untuk mengurus tugas, berfikir idea dan kekal fokus.
- Pengurusan Kewangan: Dompet, Wishlist, modul Belanjawan untuk mengesan perbelanjaan, penjimatan dan perancangan.
- Peningkatan Gaya Hidup: Jurnal, Pencapaian dan penjejakan Senaman untuk refleksi dan tabiat sihat.
- Bantuan Pembelajaran: Flashcards, Nota dan Algoritma CFOP untuk pelajar dan pembelajaran sepanjang hayat.
- Penyelesaian Stor: Perpustakaan Buku, Foto, Tali Gitar dan alat organisasi lain.
- Pengurusan Maklumat: Peti Masuk Emel dan modul Changi Airport untuk pandangan khusus.
- Penyesuaian: Modul Personalisasi untuk menyesuaikan platform mengikut pilihan anda.

Pendekatan modular memastikan fleksibiliti dan skalabiliti. Sama ada anda profesional, pelajar atau hobiis, sistem ini menyesuaikan keperluan anda.

Untuk senarai penuh modul, sila layari:

- https://github.com/lifeforge-app?q=lifeforge-module&type=all&language=&sort=

**(Sistem modul baru, Forgistry sedang dibangunkan dan akan dikeluarkan tidak lama lagi!)**

## 🖥 Tangkapan Skrin

Tangkapan skrin menunjukkan sekilas LifeForge. Terdapat lebih banyak yang boleh diterokai dalam projek.

<div align="center">
	<img width="49%" src="https://github.com/user-attachments/assets/a23e7659-b9e0-40ec-bd8c-05a7181e82b7" alt="LifeForge Dashboard">
	<img width="49%" src="https://github.com/user-attachments/assets/44985456-4df8-4c7a-8f93-1eac59de42df" alt="LifeForge Todo List Module">
	<img width="49%" src="https://github.com/user-attachments/assets/ba32412b-edd1-4b68-8f56-111c8eb64e27" alt="LifeForge Calendar">
	<img width="49%" src="https://github.com/user-attachments/assets/3d03a481-7976-42c6-a0d4-f9329118121b" alt="Code Time">
	<img width="49%" src="https://github.com/user-attachments/assets/9b93f817-9797-42d7-96ca-7bacdc8d7d3a" alt="LifeForge Wallet Module">
	<img width="49%" src="https://github.com/user-attachments/assets/41b2c15b-307a-40d6-a57f-049d1afbeba6" alt="LifeForge Book Library">
	<img width="49%" src="https://github.com/user-attachments/assets/bb6523f6-5079-44d7-b021-34cd4c787e1d">
	<img width="49%" src="https://github.com/user-attachments/assets/f6b7ed5f-219f-4990-b37d-e6273701e2bb">
	<img width="49%" src="https://github.com/user-attachments/assets/de700a7a-f80d-4656-afad-caf852b64e36">
	<img width="49%" src="https://github.com/user-attachments/assets/441d5996-1695-4eaf-b47f-ddad866a45d0">
	<img width="49%" src="https://github.com/user-attachments/assets/b5fb64bb-23f7-4aba-8dcb-2f8d9f646615">
	<img width="49%" src="https://github.com/user-attachments/assets/16b23910-37bf-4f56-892d-c971d70b19ae">
</div>

## ⌨️ Pemasangan

**LifeForge kini menyokong Docker untuk penyebaran mudah! 🐳 Anda boleh memulakan dengan beberapa arahan. Bagi yang memilih pemasangan manual, pilihan itu masih tersedia.**

Lihat dokumentasi untuk arahan pemasangan dan konfigurasi:

- https://docs.lifeforge.dev

## Sumbangan

Kami mengalu-alukan sumbangan. Sila rujuk [Contributing Guidelines](https://docs.lifeforge.dev/developer-guide/contributing).

### Sumbangan kepada Teras

Disebabkan projek ini masih dalam peringkat awal, kami menggalakkan pembangun memulakan perbincangan di [GitHub Discussions](https://github.com/lifeforge-app/lifeforge/discussions) sebelum melakukan perubahan besar.

### Mencipta Modul

Seni bina modular membolehkan pembangun mencipta dan mengintegrasikan modul. Rujuk [Module Development Guide](https://docs.lifeforge.dev/developer-guide/modules).

### Permintaan Ciri & Laporan Bug

Jika anda mempunyai idea atau menemui isu, serahkan melalui GitHub Issues: https://github.com/lifeforge-app/lifeforge/issues

Jika isu berkaitan modul tertentu, failkan dalam repositori modul tersebut.

### Terjemahan

Sukarelawan dialu-alukan untuk membantu menterjemah LifeForge. Lihat panduan terjemahan: https://docs.lifeforge.dev/developer-guide/localization

Untuk terjemahan modul khusus, rujuk dokumentasi modul itu.

## 💡 Kredit

Idea LifeForge berasal daripada keperluan sistem pengurusan peribadi yang menyatukan pelbagai alat, dan oleh [projek ini](https://github.com/Volmarg/personal-management-system). Lihat dokumentasi untuk kisah penuh.

Terima kasih kepada komuniti sumber terbuka untuk perpustakaan dan alat yang digunakan dalam projek ini.

## ⭐️ Sejarah Bintang

Pertumbuhan eksponen yang luar biasa. Terima kasih banyak kepada semua yang menyokong projek ini!

<div align="center">
<a href="https://www.star-history.com/#lifeforge-app/lifeforge&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=lifeforge-app/lifeforge&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=lifeforge-app/lifeforge&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=lifeforge-app/lifeforge&type=date&legend=top-left" />
 </picture>
</a>
</div>

## 📄 Lesen

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/LifeForge-app/lifeforge">LifeForge</a> adalah projek yang dimulakan oleh <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://github.com/melvinchia3636">Melvin Chia</a>, dan dilesenkan di bawah <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC-SA 4.0</a></p>

Lihat README utama untuk dokumentasi penuh dan arahan pemasangan:

- README utama: [README.md](../README.md)
