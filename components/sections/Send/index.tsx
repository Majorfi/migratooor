import {useCallback} from 'react';
import {SmolAddressInput} from 'components/designSystem/SmolAddressInput';
import {SmolTokenAmountInput} from 'components/designSystem/SmolTokenAmountInput';
import {useTokenList} from '@builtbymom/web3/contexts/WithTokenList';
import {useBalances} from '@builtbymom/web3/hooks/useBalances.multichains';
import {useChainID} from '@builtbymom/web3/hooks/useChainID';
import {cl, toAddress, toBigInt} from '@builtbymom/web3/utils';
import {IconCircleCheck} from '@icons/IconCircleCheck';
import {IconCircleCross} from '@icons/IconCircleCross';
import {IconCross} from '@icons/IconCross';
import {IconSpinner} from '@icons/IconSpinner';
import {useDeepCompareEffect} from '@react-hookz/web';

import {SendStatus} from './SendStatus';
import {useSendFlow} from './useSendFlow';
import {useSendQueryManagement} from './useSendQuery';
import {SendWizard} from './Wizard';

import type {TTokenAmountInputElement} from 'components/designSystem/SmolTokenAmountInput';
import type {ReactElement} from 'react';
import type {TToken} from '@builtbymom/web3/types';
import type {TInputAddressLike} from '@utils/tools.address';

function SendTokenRow({
	input,
	initialValue
}: {
	input: TTokenAmountInputElement;
	initialValue: Partial<{amount: bigint; token: TToken}>;
}): ReactElement {
	const {configuration, dispatchConfiguration} = useSendFlow();

	const onSetValue = (value: Partial<TTokenAmountInputElement>): void => {
		dispatchConfiguration({type: 'SET_VALUE', payload: {...value, UUID: input.UUID}});
	};

	const onRemoveInput = (): void => {
		dispatchConfiguration({type: 'REMOVE_INPUT', payload: {UUID: input.UUID}});
	};

	const renderIcon = (): ReactElement | null => {
		if (input.status === 'pending') {
			return <IconSpinner className={'size-4'} />;
		}
		if (input.status === 'success') {
			return <IconCircleCheck className={'size-4 text-green'} />;
		}
		if (input.status === 'error') {
			return <IconCircleCross className={'size-4 text-red'} />;
		}
		return null;
	};

	const iconContainerStyle = 'absolute -right-10 top-1/2 -translate-y-1/2';

	return (
		<div className={'relative'}>
			<SmolTokenAmountInput
				onSetValue={onSetValue}
				value={input}
				initialValue={initialValue}
			/>
			{configuration.inputs.length > 1 && input.status === 'none' && (
				<button
					className={cl(
						iconContainerStyle,
						'-right-11 p-1 text-neutral-600 transition-colors hover:text-neutral-700'
					)}
					onClick={onRemoveInput}>
					<IconCross className={'size-4'} />
				</button>
			)}

			<div className={iconContainerStyle}>{renderIcon()}</div>
		</div>
	);
}

export function Send(): ReactElement {
	const {safeChainID} = useChainID();
	const {configuration, dispatchConfiguration} = useSendFlow();
	const {initialStateFromUrl} = useSendQueryManagement();

	const {currentNetworkTokenList} = useTokenList();

	const initialTokensRaw =
		initialStateFromUrl?.tokens?.map(token => ({address: toAddress(token), chainID: safeChainID})) || [];

	const {data: initialTokens} = useBalances({tokens: initialTokensRaw});

	const isReceiverERC20 = Boolean(
		configuration.receiver.address && currentNetworkTokenList[configuration.receiver.address]
	);

	const onAddToken = useCallback((): void => {
		dispatchConfiguration({
			type: 'ADD_INPUT',
			payload: undefined
		});
	}, [dispatchConfiguration]);

	const onSetRecipient = (value: TInputAddressLike): void => {
		dispatchConfiguration({type: 'SET_RECEIVER', payload: value});
	};

	const getInitialAmount = (index: number): bigint | undefined => {
		return initialStateFromUrl?.values?.[index] ? toBigInt(initialStateFromUrl?.values[index]) : undefined;
	};

	const getInitialToken = (index: number): TToken | undefined => {
		return initialStateFromUrl?.tokens?.[index] && initialTokens[safeChainID]
			? initialTokens[safeChainID][initialStateFromUrl?.tokens[index]]
			: undefined;
	};

	/**
	 * Add missing token inputs if tokens are present in the url query
	 */
	useDeepCompareEffect(() => {
		if (!initialStateFromUrl || !Array.isArray(initialStateFromUrl.tokens)) {
			return;
		}
		initialStateFromUrl.tokens.slice(1).forEach(() => onAddToken());
	}, [initialStateFromUrl]);

	return (
		<div className={'w-full max-w-108'}>
			<div className={'mb-6'}>
				<p className={'font-medium'}>{'Receiver'}</p>
				<SmolAddressInput
					onSetValue={onSetRecipient}
					value={configuration.receiver}
					initialStateFromUrl={initialStateFromUrl?.to}
				/>
			</div>
			<div>
				<p className={'font-medium'}>{'Token'}</p>
				{configuration.inputs.map((input, index) => (
					<div
						className={'mb-4'}
						key={input.UUID}>
						<SendTokenRow
							input={input}
							initialValue={{
								amount: getInitialAmount(index),
								token: getInitialToken(index)
							}}
						/>
					</div>
				))}
			</div>
			<div className={'mb-4'}>
				<button
					className={
						'rounded-lg bg-neutral-200 px-3 py-1 text-xs text-neutral-700 transition-colors hover:bg-neutral-300'
					}
					onClick={onAddToken}>
					{'+Add token'}
				</button>
			</div>
			<SendStatus isReceiverERC20={isReceiverERC20} />
			<SendWizard isReceiverERC20={isReceiverERC20} />
		</div>
	);
}
