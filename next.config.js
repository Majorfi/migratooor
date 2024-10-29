/* eslint-disable @typescript-eslint/explicit-function-return-type */
const withPWA = require('next-pwa')({
	dest: 'public',
	disable: process.env.NODE_ENV !== 'production'
});
const withTM = require('next-transpile-modules')(['@yearn-finance/web-lib'], {resolveSymlinks: false});
const {PHASE_EXPORT} = require('next/constants');

module.exports = phase =>
	withTM(
		withPWA({
			assetPrefix: process.env.IPFS_BUILD === 'true' || phase === PHASE_EXPORT ? './' : '/',
			images: {
				unoptimized: process.env.IPFS_BUILD === 'true' || phase === PHASE_EXPORT,
				domains: [
					'gib.to',
					'rawcdn.githack.com',
					'raw.githubusercontent.com',
					'ipfs.io',
					's3.amazonaws.com',
					'1inch.exchange',
					'hut34.io',
					'www.coingecko.com',
					'defiprime.com',
					'cdn.furucombo.app',
					'gemini.com',
					'messari.io',
					'ethereum-optimism.github.io',
					'tryroll.com',
					'logo.assets.tkn.eth.limo',
					'umaproject.org',
					'cloudflare-ipfs.com',
					'assets.smold.app'
				]
			},
			redirects() {
				return [
					{
						source: '/',
						has: [{type: 'host', value: 'multisafe.app'}],
						destination: '/safe',
						permanent: true
					},
					{
						source: '/tokenlistooor/:path*',
						destination: 'https://tokenlistooor.com/:path*',
						permanent: true
					},
					{
						source: '/',
						has: [{type: 'host', value: 'disperse.smold.app'}],
						destination: '/disperse',
						permanent: true
					},
					{
						source: '/',
						has: [
							{type: 'host', value: 'migratooor.com'},
							{type: 'host', value: 'migrate.smold.app'},
							{type: 'host', value: 'migratooor.smold.app'}
						],
						destination: '/migratooor',
						permanent: true
					},
					{
						source: '/',
						has: [{type: 'host', value: 'nftmigratooor.smold.app'}],
						destination: '/migratooor',
						permanent: true
					},
					// {source: '/', has: [{type: 'host', value: 'migrate.smold.app'}], destination: '/migratooor', permanent: true},
					{
						source: '/github',
						destination: 'https://github.com/SmolDapp/smoldapp',
						permanent: true
					}
				];
			},
			async rewrites() {
				return [
					// {source: '/disperse', has: [{type: 'host', value: 'disperse.smold.app'}], destination: '/'},
					// {source: '/:path*', has: [{type: 'host', value: 'migrate.smold.app'}], destination: '/'},
					{
						source: '/js/script.js',
						destination: 'https://plausible.io/js/script.js'
					},
					{
						source: '/api/event',
						destination: 'https://plausible.io/api/event'
					}
				];
			},
			env: {
				PROJECT_SLUG: 'smoldapp',
				JSON_RPC_URL: {
					1: process.env.RPC_URL_MAINNET,
					5: process.env.RPC_URL_GOERLI,
					10: process.env.RPC_URL_OPTIMISM,
					56: process.env.RPC_URL_BINANCE,
					97: process.env.RPC_URL_BINANCE_TESTNET,
					137: process.env.RPC_URL_POLYGON,
					250: process.env.RPC_URL_FANTOM,
					420: process.env.RPC_URL_OPTIMISM_GOERLI,
					8453: process.env.RPC_URL_BASE,
					80001: process.env.RPC_URL_POLYGON_TESTNET,
					42161: process.env.RPC_URL_ARBITRUM,
					11155111: process.env.RPC_URL_SEPOLIA
				},
				ALCHEMY_KEY: process.env.ALCHEMY_KEY,
				ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
				INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
				OPENSEA_API_KEY: process.env.OPENSEA_API_KEY,
				SMOL_ASSETS_URL: 'https://assets.smold.app/api',

				// Wallet Connect modal configuration
				WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID,
				WALLETCONNECT_PROJECT_NAME: 'Smol',
				WALLETCONNECT_PROJECT_DESCRIPTION:
					'Simple, smart and elegant dapps, designed to make your crypto journey a little bit easier.',
				WALLETCONNECT_PROJECT_URL: 'https://smold.app',
				WALLETCONNECT_PROJECT_ICON: 'https://smold.app/favicons/ms-icon-310x310.png',

				RECEIVER_ADDRESS: '0x10001192576E8079f12d6695b0948C2F41320040',
				DISPERSE_ADDRESS: '0xD152f549545093347A162Dce210e7293f1452150',
				PEANUT_API_KEY: process.env.PEANUT_API_KEY
			}
		})
	);
