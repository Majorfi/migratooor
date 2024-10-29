import React from 'react';
import {DefaultSeo} from 'next-seo';
import ViewChainToSend from '@peanut/create/1.ViewChainToSend';
import ViewTokenToSend from '@peanut/create/2.ViewTokenToSend';
import ViewAmountToSend from '@peanut/create/3.ViewAmountToSend';
import ViewSuccesToSend from '@peanut/create/4.ViewSuccesToSend';
import {CreateLinkPeanutContextApp, Step, useCreateLinkPeanut} from '@peanut/create/useCreateLinkPeanut';

import type {ReactElement} from 'react';

function Peanut(): ReactElement {
	const {currentStep, set_currentStep} = useCreateLinkPeanut();

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
					{'Create a link, send it to anyone, and they can claim the funds! '}
				</b>
			</div>
			<div id={'chainToSend'}>
				<ViewChainToSend
					onProceed={(): void => {
						if (currentStep === Step.TOSENDCHAIN) {
							set_currentStep(Step.TOSENDTOKEN);
						}
					}}
				/>
			</div>

			<div
				id={'tokenToSend'}
				className={`pt-10 transition-opacity ${
					[Step.TOSENDTOKEN, Step.TOSENDAMOUNT, Step.TOSENDSUCCESS].includes(currentStep)
						? 'opacity-100'
						: 'pointer-events-none h-0 overflow-hidden opacity-0'
				}`}>
				<ViewTokenToSend
					onProceed={(): void => {
						if (currentStep === Step.TOSENDTOKEN) {
							set_currentStep(Step.TOSENDAMOUNT);
						}
					}}
				/>
			</div>

			<div
				id={'amountToSend'}
				className={`pt-10 transition-opacity ${
					[Step.TOSENDAMOUNT, Step.TOSENDSUCCESS].includes(currentStep)
						? 'opacity-100'
						: 'pointer-events-none h-0 overflow-hidden opacity-0'
				}`}>
				<ViewAmountToSend
					onProceed={(): void => {
						if (currentStep === Step.TOSENDAMOUNT) {
							set_currentStep(Step.TOSENDSUCCESS);
						}
					}}
				/>
			</div>

			<div
				id={'succesToSend'}
				className={`pt-10 transition-opacity ${
					[Step.TOSENDSUCCESS].includes(currentStep)
						? 'opacity-100'
						: 'pointer-events-none h-0 overflow-hidden opacity-0'
				}`}>
				<ViewSuccesToSend />
			</div>
		</div>
	);
}

export default function PeanutWrapper(): ReactElement {
	return (
		<CreateLinkPeanutContextApp>
			<>
				<DefaultSeo
					title={'Peanut Protocol - SmolDapp'}
					defaultTitle={'Peanut Protocol - SmolDapp'}
					description={'Send tokens to anyone, with a link.'}
					openGraph={{
						type: 'website',
						locale: 'en-US',
						url: 'https://smold.app/peanut',
						site_name: 'Peanut Protocol - SmolDapp',
						title: 'Peanut Protocol - SmolDapp',
						description: 'Send tokens to anyone, with a link.'
					}}
					twitter={{
						handle: '@smoldapp',
						site: '@smoldapp',
						cardType: 'summary_large_image'
					}}
				/>
				<Peanut />
			</>
		</CreateLinkPeanutContextApp>
	);
}
