import {Fragment, type ReactElement} from 'react';
import {useRouter} from 'next/router';
import {usePlausible} from 'next-plausible';
import {CurtainContent} from 'components/Primitives/Curtain';
import {useIsMounted} from 'hooks/useIsMounted';
import {IconCross} from '@icons/IconCross';
import * as Dialog from '@radix-ui/react-dialog';
import {useMountEffect} from '@react-hookz/web';

export function CloseCurtainButton(): ReactElement {
	const plausible = usePlausible();
	const {route} = useRouter();

	useMountEffect(() => {
		plausible('open info curtain', {props: {page: route}});
	});

	return (
		<Dialog.Close className={'withRing group -mr-1 -mt-1 rounded p-1'}>
			<IconCross className={'size-4 text-neutral-600 transition-colors group-hover:text-neutral-900'} />
			<span className={'sr-only'}>{'Close'}</span>
		</Dialog.Close>
	);
}

type TCurtainElement = {
	trigger: ReactElement;
};
export function InfoCurtain(props: TCurtainElement): ReactElement {
	const isMounted = useIsMounted();
	if (!isMounted) {
		return <Fragment />;
	}

	return (
		<Dialog.Root>
			<Dialog.Trigger>{props.trigger}</Dialog.Trigger>
			<CurtainContent>
				<aside
					style={{boxShadow: '-8px 0px 20px 0px rgba(36, 40, 51, 0.08)'}}
					className={'flex h-full flex-col bg-neutral-0 p-6'}>
					<div className={'mb-4 flex flex-row items-center justify-between'}>
						<h3 className={'font-bold'}>{'Info'}</h3>
						<CloseCurtainButton />
					</div>
					<div className={'scrollable'}>
						<p className={'whitespace-break-spaces text-neutral-600'}>
							{
								'Sending tokens to another address is a straightforward process on our platform. Please follow these step-by-step instructions to ensure a secure and successful transaction:\n\n Step 1: Log In to Your Account'
							}
						</p>
					</div>
				</aside>
			</CurtainContent>
		</Dialog.Root>
	);
}
