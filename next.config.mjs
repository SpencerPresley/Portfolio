/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: "/projects/gloss",
				destination: "/projects/docq",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
