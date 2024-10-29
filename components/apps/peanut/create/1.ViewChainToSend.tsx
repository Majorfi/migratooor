import {NetworkSelector} from 'components/common/HeaderElements';
import {Button} from '@yearn-finance/web-lib/components/Button';
import ViewSectionHeading from '@common/ViewSectionHeading';

import type {ReactElement} from 'react';

function ViewChainToSend({onProceed}: {onProceed: VoidFunction}): ReactElement {
	return (
		<section>
			<div className={'box-0 grid w-full grid-cols-12'}>
				<ViewSectionHeading
					title={'What chain are the tokens on?'}
					content={'Pick the chain that you have funds on.'}
				/>

				<div className={'col-span-12 p-4 pt-0 md:p-6 md:pt-0'}>
					<form
						suppressHydrationWarning
						onSubmit={async (e): Promise<void> => e.preventDefault()}
						className={
							'grid w-full grid-cols-12 flex-row items-center justify-between gap-4 md:w-3/4 md:gap-6'
						}>
						<div className={'grow-1 col-span-12 flex h-10 w-full items-center md:col-span-9'}>
							<div
								className={
									'relative flex w-full flex-row items-center space-x-4 border-[#B0D5CD] rounded-md border-solid p-2 px-4 border'
								}>
								<NetworkSelector
									fullWidth
									networks={[]}
								/>
							</div>{' '}
						</div>
						<div className={'col-span-12 md:col-span-3'}>
							<Button
								variant={'filled'}
								className={'yearn--button !w-[160px] rounded-md !text-sm'}
								onClick={onProceed}>
								{'Next'}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}
export default ViewChainToSend;
