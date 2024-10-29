import {useEffect, useState} from 'react';
import {IconSpinner} from '@icons/IconSpinner';
import {CHAIN_DETAILS, claimLinkGasless} from '@squirrel-labs/peanut-sdk';
import {waitForTransaction} from '@wagmi/core';
import {Button} from '@yearn-finance/web-lib/components/Button';
import {useWeb3} from '@yearn-finance/web-lib/contexts/useWeb3';

import {useClaimLinkPeanut} from './useClaimLinkPeanut';

import type {ReactElement} from 'react';

function ViewLinkDetails({onProceed}: {onProceed: VoidFunction}): ReactElement {
	const {linkDetails, set_claimTxHash, claimTxHash} = useClaimLinkPeanut();
	const {address} = useWeb3();
	const [isClient, set_isClient] = useState(false);
	const [isLoading, set_isLoading] = useState(false);

	/*
	 * Claim link
	 * Function that handles peanut functionality to claim a link.
	 * This function is the gasless function, it will not require any wallet interaction by the user. Only the link, and the address are required.
	 */
	async function onClaimLink(): Promise<void> {
		set_isLoading(true);

		if (!address) {
			alert('Please connect a wallet to claim to.');
			set_isLoading(false);
			return;
		}

		try {
			const claimLinkGaslessResp = await claimLinkGasless({
				link: linkDetails.link,
				recipientAddress: address ? address.toString() : '',
				APIKey: process.env.NEXT_PUBLIC_PEANUT_API_KEY ?? ''
			});
			waitForTransaction({hash: claimLinkGaslessResp.txHash});
			set_claimTxHash(claimLinkGaslessResp.txHash);
			set_isLoading(false);
			onProceed();
		} catch (error) {
			set_isLoading(false);
			console.log('error', error);
		}
	}

	useEffect(() => {
		set_isClient(true);
	}, []); // to prevent hydration error

	return (
		<section className={'box-0'}>
			<div className={'relative w-full'}>
				<div className={'flex flex-col p-4 text-neutral-900 md:p-6 md:pb-4'}>
					<div className={'w-full md:w-3/4'}>
						<b>{'Here are some details:'}</b>
					</div>
				</div>

				<div
					className={'grid grid-rows-3 grid-cols-2 gap-4 px-6 py-4 border-t border-neutral-200'}
					style={{gridTemplateColumns: 'max-content max-content'}}>
					<div>
						<p className={'text-s text-neutral-500'}>{'Chain:'}</p>
					</div>
					<div>
						<p className={'text-s text-neutral-500'}>
							{linkDetails.chainId ? (
								CHAIN_DETAILS[linkDetails.chainId]?.name
							) : (
								<IconSpinner
									className={
										'h-4 w-4 text-neutral-500 transition-colors group-hover:text-neutral-900'
									}
								/>
							)}
						</p>
					</div>

					<div>
						<p className={'text-s text-neutral-500'}>{'Amount:'}</p>
					</div>
					<div>
						<p className={'text-s text-neutral-500'}>
							{linkDetails.tokenAmount ? (
								linkDetails.tokenAmount
							) : (
								<IconSpinner
									className={
										'h-4 w-4 text-neutral-500 transition-colors group-hover:text-neutral-900'
									}
								/>
							)}
						</p>
					</div>
					<div>
						<p className={'text-s text-neutral-500'}>{'Token:'}</p>
					</div>
					<div>
						<p className={'text-s text-neutral-500'}>
							{linkDetails.tokenName ? (
								linkDetails.tokenName
							) : (
								<IconSpinner
									className={
										'h-4 w-4 text-neutral-500 transition-colors group-hover:text-neutral-900'
									}
								/>
							)}
						</p>
					</div>
					<div>
						<p className={'text-s text-neutral-500'}>{'Address:'}</p>
					</div>
					<div>
						<p className={'text-s text-neutral-500'}>
							{linkDetails.tokenAddress ? (
								linkDetails.tokenAddress
							) : (
								<IconSpinner
									className={
										'h-4 w-4 text-neutral-500 transition-colors group-hover:text-neutral-900'
									}
								/>
							)}
						</p>
					</div>
				</div>

				<div
					className={
						'sticky inset-x-0 bottom-0 z-20 flex w-full max-w-5xl flex-row items-center justify-between rounded-b-[5px] bg-primary-600 p-4 text-primary-0 md:relative md:px-6 md:py-4'
					}>
					<div
						className={'flex w-3/4 flex-col'}
						suppressHydrationWarning>
						{isClient
							? linkDetails.claimed || claimTxHash
								? 'This link has already been claimed'
								: address
									? 'You are claiming to ' + address
									: 'Please connect a wallet to claim to.'
							: ''}
					</div>

					<div className={'flex flex-col items-end w-full'}>
						<Button
							className={'yearn--button !w-fit !px-6 !text-sm'}
							variant={'reverted'}
							onClick={onClaimLink}
							isDisabled={linkDetails.claimed || claimTxHash}>
							{isLoading ? (
								<div className={'flex flex-row gap-2 justify-center items-center'}>
									{'Claiming'}
									<IconSpinner
										className={
											'h-4 w-4 text-neutral-500 transition-colors group-hover:text-neutral-900'
										}
									/>
								</div>
							) : (
								'Claim'
							)}
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
export default ViewLinkDetails;
