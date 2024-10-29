import {useMemo} from 'react';
import {CHAIN_DETAILS} from '@squirrel-labs/peanut-sdk';
import ViewSectionHeading from '@common/ViewSectionHeading';

import {useClaimLinkPeanut} from './useClaimLinkPeanut';

import type {ReactElement} from 'react';

function ViewClaimSuccess(): ReactElement {
	const {linkDetails, claimTxHash} = useClaimLinkPeanut();

	const blockExplorerUrl = useMemo(() => {
		return CHAIN_DETAILS[linkDetails.chainId]?.explorers[0].url;
	}, [linkDetails.chainId, CHAIN_DETAILS]);

	return (
		<section>
			<div className={'box-0 grid w-full grid-cols-12'}>
				<ViewSectionHeading
					title={'You have successfully claimed your funds!'}
					content={'Click the transaction hash to see the transaction confirmation.'}
				/>

				<div className={'col-span-12 p-4 pt-0 md:p-6 md:pt-0'}>
					<div className={'flex flex-col gap-2'}>
						<a
							href={`${blockExplorerUrl}/tx/${claimTxHash}`}
							target={'_blank'}
							className={'w-full text-sm text-neutral-500 md:w-3/4 underline cursor-pointer'}>
							{claimTxHash}
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
export default ViewClaimSuccess;
