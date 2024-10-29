import React, {useEffect} from 'react';
import {DefaultSeo} from 'next-seo';
import ViewLinkDetails from '@peanut/claim/1.LinkDetails';
import ViewClaimSuccess from '@peanut/claim/2.ClaimSuccess';
import {ClaimLinkPeanutContextApp, Step, useClaimLinkPeanut} from '@peanut/claim/useClaimLinkPeanut';

import type {ReactElement} from 'react';

function Peanut(): ReactElement {
	const {currentStep, set_currentStep, set_claimUrl} = useClaimLinkPeanut();

	useEffect(() => {
		if (window.location.href) {
			set_claimUrl(window.location.href);
		}
	}, []);

	return (
		<div className={'mx-auto grid w-full max-w-4xl'}>
			<div className={'mb-10 mt-6 flex flex-col justify-center md:mt-20'}>
				<h1 className={'-ml-1 mt-4 w-full text-3xl tracking-tight text-neutral-900 md:mt-6 md:text-5xl'}>
					{'Peanut Protocol'}
				</h1>
				<b
					className={
						'mt-4 w-full whitespace-pre text-base leading-normal text-neutral-500 md:w-2/3 md:text-lg md:leading-8'
					}>
					{'You have been sent a link which holds tokens. Claim them directly to your wallet now! '}
				</b>
			</div>
			<div id={'chainToSend'}>
				<ViewLinkDetails
					onProceed={(): void => {
						if (currentStep === Step.LINKDETAILS) {
							set_currentStep(Step.CLAIMSUCCESS);
						}
					}}
				/>
			</div>

			<div
				id={'tokenToSend'}
				className={`pt-10 transition-opacity ${
					[Step.CLAIMSUCCESS].includes(currentStep)
						? 'opacity-100'
						: 'pointer-events-none h-0 overflow-hidden opacity-0'
				}`}>
				<ViewClaimSuccess />
			</div>
		</div>
	);
}

export default function PeanutWrapper(): ReactElement {
	return (
		<ClaimLinkPeanutContextApp>
			<>
				<DefaultSeo
					title={'Peanut Protocol - SmolDapp'}
					defaultTitle={'Peanut Protocol - SmolDapp'}
					description={'Claim tokens to any wallet.'}
					openGraph={{
						type: 'website',
						locale: 'en-US',
						url: 'https://smold.app/peanut/claim',
						site_name: 'Peanut Protocol - SmolDapp',
						title: 'Peanut Protocol - SmolDapp',
						description: 'Claim tokens to any wallet.'
					}}
					twitter={{
						handle: '@smoldapp',
						site: '@smoldapp',
						cardType: 'summary_large_image'
					}}
				/>
				<Peanut />
			</>
		</ClaimLinkPeanutContextApp>
	);
}
