import React, {createContext, type Dispatch, type SetStateAction, useEffect, useMemo, useState} from 'react';
import {useUpdateEffect} from '@react-hookz/web';
import {scrollToTargetAdjusted} from '@utils/animations';
import {HEADER_HEIGHT} from '@utils/constants';
import {useWeb3} from '@yearn-finance/web-lib/contexts/useWeb3';
import {ETH_TOKEN_ADDRESS} from '@yearn-finance/web-lib/utils/constants';
import {getNetwork} from '@yearn-finance/web-lib/utils/wagmi/utils';

import type {TNormalizedBN} from '@yearn-finance/web-lib/utils/format.bigNumber';
import type {TToken} from '@utils/types/types';

export enum Step {
	TOSENDCHAIN = 'destination_chain',
	TOSENDTOKEN = 'destination_token',
	TOSENDAMOUNT = 'destination_amount',
	TOSENDSUCCESS = 'destination_success'
}

export type TCreatedLink = {
	hash: string;
	link: string;
};

export type TSelected = {
	tokenToSend: TToken;
	currentStep: Step;
	amountToSend: TNormalizedBN | undefined;
	createdLink: TCreatedLink;
	set_createdLink: Dispatch<SetStateAction<TCreatedLink>>;
	set_tokenToSend: Dispatch<SetStateAction<TToken>>;
	set_currentStep: Dispatch<SetStateAction<Step>>;
	set_amountToSend: Dispatch<SetStateAction<TNormalizedBN | undefined>>;
	onResetCreateLink: () => void;
};

const {wrappedToken: defaultTokens} = getNetwork(1).contracts;
const defaultProps: TSelected = {
	tokenToSend: {
		address: ETH_TOKEN_ADDRESS,
		chainID: 1,
		name: defaultTokens?.coinName || 'Ether',
		symbol: defaultTokens?.coinSymbol || 'ETH',
		decimals: defaultTokens?.decimals || 18,
		logoURI: `${process.env.SMOL_ASSETS_URL}/token/1/${ETH_TOKEN_ADDRESS}/logo-128.png`
	},
	currentStep: Step.TOSENDCHAIN,
	amountToSend: undefined,
	createdLink: {
		hash: '',
		link: ''
	},
	set_createdLink: (): void => undefined,
	set_tokenToSend: (): void => undefined,
	set_currentStep: (): void => undefined,
	set_amountToSend: (): void => undefined,
	onResetCreateLink: (): void => undefined
};

const CreateLinkPeanutContext = createContext<TSelected>(defaultProps);
export const CreateLinkPeanutContextApp = ({children}: {children: React.ReactElement}): React.ReactElement => {
	const {address, isActive, isWalletSafe, isWalletLedger, onConnect} = useWeb3();
	const [currentStep, set_currentStep] = useState<Step>(Step.TOSENDCHAIN);
	const [tokenToSend, set_tokenToSend] = useState<TToken>(defaultProps.tokenToSend);
	const [createdLink, set_createdLink] = useState<TCreatedLink>(defaultProps.createdLink);

	const [amountToSend, set_amountToSend] = useState<TNormalizedBN | undefined>(undefined);

	const onResetCreateLink = (): void => {
		setTimeout(() => {
			set_currentStep(Step.TOSENDCHAIN);
			set_tokenToSend(defaultProps.tokenToSend);
			set_amountToSend(undefined);
			set_createdLink(defaultProps.createdLink);
		}, 500);
	};

	/**********************************************************************************************
	 ** This effect is used to directly ask the user to connect its wallet if it's not connected
	 **********************************************************************************************/
	useEffect((): void => {
		if (!isActive && !address) {
			onConnect();
			return;
		}
	}, [address, isActive, onConnect]);

	/**********************************************************************************************
	 ** This effect is used to handle some UI transitions and sections jumps. Once the current step
	 ** changes, we need to scroll to the correct section.
	 ** This effect is ignored on mount but will be triggered on every update to set the correct
	 ** scroll position.
	 **********************************************************************************************/
	useUpdateEffect((): void => {
		setTimeout((): void => {
			let currentStepContainer;
			const scalooor = document?.getElementById('scalooor');

			if (currentStep === Step.TOSENDCHAIN) {
				currentStepContainer = document?.getElementById('chainToSend');
			} else if (currentStep === Step.TOSENDTOKEN) {
				currentStepContainer = document?.getElementById('tokenToSend');
			} else if (currentStep === Step.TOSENDAMOUNT) {
				currentStepContainer = document?.getElementById('amountToSend');
			} else if (currentStep === Step.TOSENDSUCCESS) {
				currentStepContainer = document?.getElementById('successToSend');
			}
			const currentElementHeight = currentStepContainer?.offsetHeight;
			if (scalooor?.style) {
				scalooor.style.height = `calc(100vh - ${currentElementHeight}px - ${HEADER_HEIGHT}px + 36px)`;
			}
			if (currentStepContainer) {
				scrollToTargetAdjusted(currentStepContainer);
			}
		}, 0);
	}, [currentStep, isWalletLedger, isWalletSafe]);

	const contextValue = useMemo(
		(): TSelected => ({
			currentStep,
			set_currentStep,
			tokenToSend,
			set_tokenToSend,
			amountToSend,
			set_amountToSend,
			onResetCreateLink,
			createdLink,
			set_createdLink
		}),
		[currentStep, tokenToSend, amountToSend]
	);

	return (
		<CreateLinkPeanutContext.Provider value={contextValue}>
			<div className={'mx-auto w-full'}>
				{children}
				<div id={'scalooor'} />
			</div>
		</CreateLinkPeanutContext.Provider>
	);
};

export const useCreateLinkPeanut = (): TSelected => React.useContext(CreateLinkPeanutContext);
