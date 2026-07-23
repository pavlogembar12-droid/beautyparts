/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Дозволяємо завантажувати картинки з ImgBB (чи іншого хостингу фото, який зараз використовується)
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
    ],
  },
};

module.exports = nextConfig;
