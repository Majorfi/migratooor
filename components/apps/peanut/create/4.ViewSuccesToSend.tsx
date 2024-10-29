import {useMemo} from 'react';
import {CHAIN_DETAILS} from '@squirrel-labs/peanut-sdk';
import {useChainID} from '@yearn-finance/web-lib/hooks/useChainID';

import {useCreateLinkPeanut} from './useCreateLinkPeanut';

import type {ReactElement} from 'react';

function ViewSuccesToSend(): ReactElement {
	const {createdLink} = useCreateLinkPeanut();
	const {safeChainID} = useChainID();

	const blockExplorerUrl = useMemo(() => {
		return CHAIN_DETAILS[safeChainID]?.explorers[0].url;
	}, [safeChainID, CHAIN_DETAILS]);

	return (
		<section>
			<div className={'box-0 grid w-full grid-cols-12'}>
				<div className={'relative col-span-12 flex flex-col p-4 text-neutral-900 md:p-6'}>
					<div className={'w-full md:w-3/4'}>
						<b suppressHydrationWarning>{'The link has been created!'}</b>
						<div className={'flex flex-row gap-1'}>
							<p
								suppressHydrationWarning
								className={'whitespace-pre-wrap text-sm text-neutral-500'}>
								{'Click'}
							</p>
							<a
								href={`${blockExplorerUrl}/tx/${createdLink.hash}`}
								target={'_blank'}
								className={'whitespace-pre-wrap underline text-sm text-neutral-500'}>
								{'here'}
							</a>
							<p
								suppressHydrationWarning
								className={'whitespace-pre-wrap text-sm text-neutral-500'}>
								{'to see the transaction confirmation.'}
							</p>
						</div>
					</div>
				</div>
				<div className={'col-span-12 p-4 pt-0 md:p-6 md:pt-0 flex flex-col gap-2'}>
					<a
						href={createdLink.link}
						target={'_blank'}
						className={'w-full underline text-sm text-neutral-500 md:w-3/4'}>
						{createdLink.link}
					</a>
				</div>
			</div>
		</section>
	);
}
export default ViewSuccesToSend;
