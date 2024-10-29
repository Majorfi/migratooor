import React, {createContext, type Dispatch, type SetStateAction, useEffect, useMemo, useState} from 'react';
import {useUpdateEffect} from '@react-hookz/web';
import {getLinkDetails} from '@squirrel-labs/peanut-sdk';
import {scrollToTargetAdjusted} from '@utils/animations';
import {HEADER_HEIGHT} from '@utils/constants';
import {useWeb3} from '@yearn-finance/web-lib/contexts/useWeb3';

export enum Step {
	LINKDETAILS = 'link_details',
	CLAIMSUCCESS = 'claim_success'
}

export type TClaimLink = {
	linkDetails: any;
	set_linkDetails: Dispatch<SetStateAction<any>>;
	currentStep: Step;
	set_currentStep: Dispatch<SetStateAction<Step>>;
	claimTxHash: string;
	set_claimTxHash: Dispatch<SetStateAction<string>>;
	claimUrl: string;
	set_claimUrl: Dispatch<SetStateAction<string>>;
};

const defaultProps: TClaimLink = {
	linkDetails: {},
	set_linkDetails: (): void => undefined,
	currentStep: Step.LINKDETAILS,
	set_currentStep: (): void => undefined,
	claimTxHash: '',
	set_claimTxHash: (): void => undefined,
	claimUrl: '',
	set_claimUrl: (): void => undefined
};

const ClaimLinkPeanutContext = createContext<TClaimLink>(defaultProps);
export const ClaimLinkPeanutContextApp = ({children}: {children: React.ReactElement}): React.ReactElement => {
	const {address, isActive, isWalletSafe, isWalletLedger, onConnect} = useWeb3();
	const [currentStep, set_currentStep] = useState<Step>(Step.LINKDETAILS);
	const [linkDetails, set_linkDetails] = useState<any>({});
	const [claimTxHash, set_claimTxHash] = useState<string>('');
	const [claimUrl, set_claimUrl] = useState<string>('');

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

			if (currentStep === Step.LINKDETAILS) {
				currentStepContainer = document?.getElementById('linkDetails');
			} else if (currentStep === Step.CLAIMSUCCESS) {
				currentStepContainer = document?.getElementById('claimSuccess');
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

	useEffect(() => {
		if (claimUrl) {
			peanutGetLinkDetails({claimUrl});
		}
	}, [claimUrl]);

	/**********************************************************************************************
	 ** This function is used to get the details of the link (amount, token, chain).
	 **********************************************************************************************/
	async function peanutGetLinkDetails({claimUrl}: {claimUrl: string}): Promise<any> {
		try {
			const linkDetails = await getLinkDetails({
				link: claimUrl
			});
			console.log('linkDetails', linkDetails);
			set_linkDetails(linkDetails);
		} catch (error) {
			console.error(error);
		}
	}

	const contextValue = useMemo(
		(): TClaimLink => ({
			currentStep,
			set_currentStep,
			linkDetails,
			set_linkDetails,
			claimTxHash,
			set_claimTxHash,
			claimUrl,
			set_claimUrl
		}),
		[currentStep, set_currentStep, linkDetails, set_linkDetails, claimTxHash, set_claimTxHash]
	);

	return (
		<ClaimLinkPeanutContext.Provider value={contextValue}>
			<div className={'mx-auto w-full'}>
				{children}
				<div id={'scalooor'} />
			</div>
		</ClaimLinkPeanutContext.Provider>
	);
};

export const useClaimLinkPeanut = (): TClaimLink => React.useContext(ClaimLinkPeanutContext);
