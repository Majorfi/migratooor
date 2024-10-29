import React, {Fragment} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LogoDisperse from '@disperse/Logo';
import {LogoTokenAssets} from '@icons/LogoTokenAssets';
import LogoTokenlistooor from '@icons/LogoTokenListooor';
import LogoMigratooor from '@migratooor/Logo';
import LogoNFTMigratooor from '@nftmigratooor/Logo';
import LogoPeanutCreator from '@peanut/create/Logo';
import LogoSafeCreator from '@safeCreatooor/Logo';
import LogoStream from '@stream/Logo';
import {Button} from '@yearn-finance/web-lib/components/Button';

import type {ReactElement} from 'react';

const apps = [
	{
		href: '/peanut',
		title: 'Peanut Protocol',
		description: (
			<span>
				{'Send tokens to anyone, with a '}
				<span className={'font-semibold text-primary-500 transition-colors group-hover:text-primary-0'}>
					{'link'}
				</span>
				{'.'}
			</span>
		),
		icon: <LogoPeanutCreator className={'h-[80px] w-[80px]'} />
	},
	{
		href: '/safe',
		title: 'MultiSafe',
		description: (
			<span>
				{'One address, all the chains. Deploy your Safe across '}
				<span className={'font-semibold text-primary-500 transition-colors group-hover:text-primary-0'}>
					{'multiple chains'}
				</span>
				{'.'}
			</span>
		),
		icon: <LogoSafeCreator className={'size-[80px]'} />
	},
	{
		href: '/stream',
		title: 'SmolStream',
		description: (
			<span>
				<span className={'font-semibold text-primary-500 transition-colors group-hover:text-primary-0'}>
					{'Stream'}
				</span>
				{' salaries, token vest, or something else… simply, safely and sexily with SmolStream'}
			</span>
		),
		icon: <LogoStream className={'size-[80px]'} />
	},
	{
		href: '/disperse',
		title: 'Disperse',
		description: (
			<span>
				<span className={'font-semibold text-primary-500 transition-colors group-hover:text-primary-0'}>
					{'Distribute'}
				</span>
				{' ether or tokens to multiple addresses.'}
			</span>
		),
		icon: <LogoDisperse className={'size-[80px]'} />
	},
	{
		href: 'https://dump.services',
		title: 'Dump Services',
		description: (
			<span>
				<span className={'font-semibold text-primary-500 transition-colors group-hover:text-primary-0'}>
					{'Dump'}
				</span>
				{' your tokens like a pro'}
			</span>
		),
		icon: (
			<Image
				src={'/dumpservices.svg'}
				width={80}
				height={80}
				alt={'dump.services'}
			/>
		)
	},
	{
		href: '/migratooor',
		title: 'Migratooor',
		description: (
			<span>
				{'The hassle-free solution to '}
				<span className={'font-semibold text-primary-500 transition-colors group-hover:text-primary-0'}>
					{'migrate'}
				</span>
				{' your tokens.'}
			</span>
		),
		icon: <LogoMigratooor className={'size-[80px]'} />
	},
	{
		href: '/nftmigratooor',
		title: 'NFTMigratooor',
		description: (
			<span>
				{'Easily '}
				<span className={'font-semibold text-primary-500 transition-colors group-hover:text-primary-0'}>
					{'migrate your NFTs'}
				</span>
				{' to your new wallet.'}
			</span>
		),
		icon: <LogoNFTMigratooor className={'size-[80px]'} />
	},
	{
		href: 'https://tokenlistooor.com',
		title: 'Tokenlistooor',
		description: (
			<span>
				{'An up to date automatic '}
				<span className={'font-semibold text-primary-500 transition-colors group-hover:text-primary-0'}>
					{'tokenList'}
				</span>
				{' for your dApp.'}
			</span>
		),
		icon: <LogoTokenlistooor className={'size-[80px]'} />
	},
	{
		href: '/tokenlistooor/list/smolAssets',
		title: 'Token Assets',
		description: (
			<span>
				{'A simple way to get '}
				<span className={'font-semibold text-primary-500 transition-colors group-hover:text-primary-0'}>
					{'token logos'}
				</span>
				{'. Noice.'}
			</span>
		),
		icon: <LogoTokenAssets className={'size-[80px]'} />
	}
];

function AppBox({app}: {app: (typeof apps)[0]}): ReactElement {
	return (
		<Link
			prefetch={false}
			key={app.href}
			href={app.href}
			className={'relative'}>
			<div
				id={app.href}
				className={'appBox group'}>
				<div className={'box-0 !rounded-full'}>{app.icon}</div>
				<div className={'pt-6 text-left'}>
					<b className={'text-lg'}>{app.title}</b>
					<p>{app.description}</p>
				</div>
			</div>
		</Link>
	);
}

function Index(): ReactElement {
	return (
		<Fragment>
			<div className={'mx-auto grid w-full max-w-4xl'}>
				<div className={'mb-0 mt-10 grid grid-cols-6 flex-col md:mb-14 md:mt-20 md:grid-cols-12'}>
					<div className={'col-span-6'}>
						<h1 className={'flex text-5xl font-bold lowercase text-neutral-900 md:text-8xl'}>{'Smol'}</h1>
						<div className={'mb-2 mt-4'}>
							<p className={'w-10/12 text-lg'}>
								{
									'Simple, smart and elegant dapps, designed to make your crypto journey a little bit easier.'
								}
							</p>
						</div>
						<div className={'mb-12 mt-8 flex flex-row items-center space-x-6'}>
							<Link
								tabIndex={-1}
								href={'https://twitter.com/smoldapp'}
								target={'_blank'}>
								<Button className={'w-[140px]'}>{'Twitter'}</Button>
							</Link>
							<Link
								tabIndex={-1}
								href={'https://github.com/smoldapp'}
								target={'_blank'}>
								<Button className={'w-[140px]'}>{'Github'}</Button>
							</Link>
						</div>
					</div>
					<div
						id={'container'}
						className={'col-span-6 hidden items-center justify-center md:flex'}>
						<p className={'text-neutral-400'}>{'Oh no so much empty space'}</p>
					</div>
				</div>
			</div>
			<div className={'mx-auto grid w-full max-w-4xl'}>
				<section className={'mb-20 grid grid-cols-1 gap-6 md:grid-cols-3'}>
					{apps.map(
						(app): ReactElement => (
							<AppBox
								key={app.href}
								app={app}
							/>
						)
					)}
				</section>
			</div>
		</Fragment>
	);
}

export default Index;
