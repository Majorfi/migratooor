import React, {memo, useCallback, useMemo, useState} from 'react';
import {useWallet} from 'contexts/useWallet';
import {handleInputChangeEventValue} from 'utils/handleInputChangeEventValue';
import {IconSpinner} from '@icons/IconSpinner';
import {CHAIN_DETAILS, getLinksFromTx, getRandomString, prepareDepositTxs} from '@squirrel-labs/peanut-sdk';
import {prepareSendTransaction, sendTransaction, waitForTransaction} from '@wagmi/core';
import {Button} from '@yearn-finance/web-lib/components/Button';
import {useWeb3} from '@yearn-finance/web-lib/contexts/useWeb3';
import {useChainID} from '@yearn-finance/web-lib/hooks/useChainID';
import {isZeroAddress, toAddress} from '@yearn-finance/web-lib/utils/address';
import {formatAmount} from '@yearn-finance/web-lib/utils/format.number';

import {useCreateLinkPeanut} from './useCreateLinkPeanut';

import type {ChangeEvent, ReactElement} from 'react';
import type {TNormalizedBN} from '@yearn-finance/web-lib/utils/format.bigNumber';
import type {TToken} from '@utils/types/types';

function AmountToSendInput({
	token,
	amount,
	onChange
}: {
	token: TToken | undefined;
	amount: TNormalizedBN | undefined;
	onChange: (amount: TNormalizedBN) => void;
}): ReactElement {
	/**********************************************************************************************
	 ** onInputChange is triggered when the user is typing in the input field. It updates the
	 ** amount in the state and triggers the debounced retrieval of the quote from the Cowswap API.
	 ** It is set as callback to avoid unnecessary re-renders.
	 **********************************************************************************************/
	const onInputChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>): void => {
			onChange(handleInputChangeEventValue(e, token?.decimals || 18));
		},
		[onChange, token?.decimals]
	);

	return (
		<div
			key={token?.address}
			className={'box-0 flex h-10 w-full items-center p-2'}>
			<div className={'flex h-10 w-full flex-row items-center justify-between px-0 py-4'}>
				<input
					className={'smol--input font-mono font-bold'}
					type={'number'}
					onWheel={(e): void => e.preventDefault()}
					min={0}
					step={1 / 10 ** (token?.decimals || 18)}
					inputMode={'numeric'}
					placeholder={'0'}
					pattern={'^((?:0|[1-9]+)(?:.(?:d+?[1-9]|[1-9]))?)$'}
					onChange={onInputChange}
					value={amount?.normalized}
				/>
			</div>
		</div>
	);
}

const ViewAmountToSend = memo(function ViewAmountToSend({onProceed}: {onProceed: VoidFunction}): ReactElement {
	const {safeChainID} = useChainID();
	const {address} = useWeb3();
	const {balances} = useWallet();
	const {tokenToSend, amountToSend, set_amountToSend, createdLink, set_createdLink, onResetCreateLink} =
		useCreateLinkPeanut();
	const [loadingStates, set_loadingStates] = useState<'idle' | 'Confirm in wallet' | 'Creating'>('idle');

	const isLoading = useMemo(() => loadingStates !== 'idle', [loadingStates]);

	const balanceOf = useMemo((): number => {
		if (isZeroAddress(tokenToSend?.address)) {
			return 0;
		}
		const balance = balances?.[toAddress(tokenToSend?.address)]?.normalized;
		return balance || 0;
	}, [balances, tokenToSend]);

	const isAboveBalance = (Number(amountToSend?.normalized) ?? 0) > balanceOf;

	/*
	 * Function to handle the creation of a link. ChainId, tokenAmount and tokenAddress are required.
	 * Done using advanced implementation (prepare, signing and getting the link are done seperately)
	 */
	const onCreateLink = async (): Promise<void> => {
		try {
			set_loadingStates('Creating');
			const tokenType =
				CHAIN_DETAILS[safeChainID as keyof typeof CHAIN_DETAILS]?.nativeCurrency.symbol == tokenToSend.symbol
					? 0
					: 1;

			const linkDetails = {
				chainId: safeChainID.toString(),
				tokenAmount: Number(amountToSend?.normalized),
				tokenAddress: tokenToSend?.address,
				tokenDecimals: tokenToSend?.decimals,
				tokenType: tokenType,
				baseUrl: `${window.location.href}/claim`,
				trackId: 'smoldapp'
			};

			const password = await getRandomString(16);

			const preparedTxs = await prepareDepositTxs({
				address: address ?? '',
				linkDetails: linkDetails,
				passwords: [password]
			});
			const signedTxsResponse = [];

			for (const tx of preparedTxs.unsignedTxs) {
				set_loadingStates('Confirm in wallet');

				const config = await prepareSendTransaction({
					to: tx.to ?? undefined,
					data: (tx.data as `0x${string}`) ?? undefined,
					value: tx.value?.valueOf() ?? undefined
				});
				const sendTxResponse = await sendTransaction(config);
				set_loadingStates('Creating');
				await waitForTransaction({hash: sendTxResponse.hash, confirmations: 4});

				signedTxsResponse.push(sendTxResponse);
			}

			const getLinkFromTxResponse = await getLinksFromTx({
				linkDetails: linkDetails,
				txHash: signedTxsResponse[signedTxsResponse.length - 1].hash,
				passwords: [password]
			});

			set_createdLink({
				link: getLinkFromTxResponse.links[0],
				hash: signedTxsResponse[signedTxsResponse.length - 1].hash
			});
			set_loadingStates('idle');
			onProceed();
		} catch (error) {
			console.error(error);
			set_loadingStates('idle');
		}
	};

	return (
		<section className={'box-0'}>
			<div className={'relative w-full'}>
				<div className={'flex flex-col p-4 text-neutral-900 md:p-6 md:pb-4'}>
					<div className={'w-full md:w-3/4'}>
						<b>{'How much do you want to send?'}</b>
						<p className={'text-sm text-neutral-500'}>
							{'Drop the amount of tokens you want the link to hold.'}
						</p>
					</div>
				</div>

				<div className={'border-t border-neutral-200 p-6'}>
					<div className={'mb-2 grid grid-cols-1 gap-4'}>
						<p className={'text-xs text-neutral-500'}>{'Amount'}</p>
					</div>
					<div className={'grid grid-cols-1 gap-x-4 gap-y-2'}>
						<AmountToSendInput
							token={tokenToSend}
							amount={amountToSend}
							onChange={(amount): void => {
								set_amountToSend(amount);
							}}
						/>
					</div>
				</div>
				<div
					className={
						'sticky inset-x-0 bottom-0 z-20 flex w-full max-w-5xl flex-row items-center justify-between rounded-b-[5px] bg-primary-600 p-4 text-primary-0 md:relative md:px-6 md:py-4'
					}>
					<div className={'flex w-3/4 flex-col'}>
						<dl className={'container whitespace-nowrap text-xs'}>
							<dt>{'You have'}</dt>
							<span className={'filler'} />
							<dd suppressHydrationWarning>
								{`${formatAmount(balanceOf, tokenToSend?.decimals || 18)} ${tokenToSend?.symbol || ''}`}
							</dd>
						</dl>
						<dl className={'container whitespace-nowrap text-xs'}>
							<dt>{'You are sending'}</dt>
							<span className={'filler'} />
							<dd
								suppressHydrationWarning
								className={isAboveBalance ? 'text-[#FE0000]' : ''}>
								{`${formatAmount(amountToSend?.normalized ?? '0', tokenToSend?.decimals || 18)} ${
									tokenToSend?.symbol || ''
								}`}
							</dd>
						</dl>
					</div>
					<div className={'flex flex-col'}>
						<Button
							className={'yearn--button !w-fit !px-6 !text-sm'}
							variant={'reverted'}
							isDisabled={isAboveBalance || isLoading}
							onClick={() => {
								if (createdLink.link !== '') {
									onResetCreateLink();
									set_amountToSend(undefined);
								} else {
									onCreateLink();
								}
							}}>
							{isLoading ? (
								<div className={'flex flex-row gap-2 justify-center items-center'}>
									{loadingStates}
									<IconSpinner
										className={
											'h-4 w-4 text-neutral-500 transition-colors group-hover:text-neutral-900'
										}
									/>
								</div>
							) : createdLink.link !== '' ? (
								'Reset'
							) : (
								'Create link'
							)}
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
});

export default ViewAmountToSend;
