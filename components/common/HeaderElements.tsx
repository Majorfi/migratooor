import React, {Fragment, useEffect, useMemo, useState} from 'react';
import Image from 'next/image';
import assert from 'assert';
import {useConnect, usePublicClient} from 'wagmi';
import {Listbox, Transition} from '@headlessui/react';
import {useAccountModal, useChainModal} from '@rainbow-me/rainbowkit';
import {useIsMounted} from '@react-hookz/web';
import {useWeb3} from '@yearn-finance/web-lib/contexts/useWeb3';
import {toSafeChainID} from '@yearn-finance/web-lib/hooks/useChainID';
import {IconChevronBottom} from '@yearn-finance/web-lib/icons/IconChevronBottom';
import {IconWallet} from '@yearn-finance/web-lib/icons/IconWallet';
import {truncateHex} from '@yearn-finance/web-lib/utils/address';

import type {ReactElement} from 'react';
import type {Chain} from 'wagmi';

function NetworkButton({
	label,
	isDisabled,
	onClick
}: {
	label: string;
	isDisabled?: boolean;
	onClick?: () => void;
}): ReactElement {
	return (
		<button
			disabled={isDisabled}
			onClick={onClick}
			suppressHydrationWarning
			className={
				'yearn--header-nav-item mr-4 hidden !cursor-default flex-row items-center border-0 p-0 text-sm hover:!text-neutral-500 md:flex'
			}>
			<div
				suppressHydrationWarning
				className={'relative flex flex-row items-center'}>
				{label}
			</div>
		</button>
	);
}

function CurrentNetworkButton({
	label,
	value,
	isOpen,
	fullWidth
}: {
	label: string;
	value: number;
	isOpen: boolean;
	fullWidth?: boolean;
}): ReactElement {
	const [src, set_src] = useState<string | undefined>(undefined);

	useEffect((): void => {
		if (value) {
			set_src(`${process.env.SMOL_ASSETS_URL}/chain/${value}/logo-128.png`);
		}
	}, [value]);

	return (
		<Listbox.Button
			suppressHydrationWarning
			className={
				'yearn--header-nav-item flex flex-row items-center  border-0 p-0 text-xs md:flex md:text-sm ' +
				(fullWidth ? ' justify-between w-full ' : '')
			}>
			<div
				suppressHydrationWarning
				className={'relative flex flex-row items-center truncate whitespace-nowrap text-xs md:text-sm'}>
				{src ? (
					<Image
						suppressHydrationWarning
						id={value.toString()}
						className={'mr-2 min-h-[20px] min-w-[20px]'}
						src={src}
						width={20}
						height={20}
						alt={label}
					/>
				) : (
					<div className={'mr-2 min-h-[20px] min-w-[20px] animate-pulse rounded-full bg-neutral-200'} />
				)}
				{label}
			</div>
			<div className={'ml-1 md:ml-2'}>
				<IconChevronBottom
					className={`h-3 w-3 transition-transform md:h-5 md:w-4 ${isOpen ? '-rotate-180' : 'rotate-0'}`}
				/>
			</div>
		</Listbox.Button>
	);
}

type TNetwork = {value: number; label: string};
export function NetworkSelector({networks, fullWidth}: {networks: number[]; fullWidth?: boolean}): ReactElement {
	const {onSwitchChain} = useWeb3();
	const publicClient = usePublicClient();
	const {connectors} = useConnect();
	const safeChainID = toSafeChainID(publicClient?.chain.id, Number(process.env.BASE_CHAINID));
	const isMounted = useIsMounted();

	const supportedNetworks = useMemo((): TNetwork[] => {
		const injectedConnector = connectors.find((e): boolean => e.id.toLocaleLowerCase() === 'injected');
		assert(injectedConnector, 'No injected connector found');
		const chainsForInjected = injectedConnector.chains;

		return chainsForInjected
			.filter(
				({id}): boolean =>
					![5, 1337, 84531].includes(id) && ((networks.length > 0 && networks.includes(id)) || true)
			)
			.map((network: Chain): TNetwork => ({value: network.id, label: network.name}));
	}, [connectors, networks]);

	const currentNetwork = useMemo(
		(): TNetwork | undefined => supportedNetworks.find((network): boolean => network.value === safeChainID),
		[safeChainID, supportedNetworks]
	);

	if (supportedNetworks.length === 1) {
		if (publicClient?.chain.id === 1337) {
			return (
				<NetworkButton
					label={'Localhost'}
					isDisabled
				/>
			);
		}
		if (currentNetwork?.value === supportedNetworks[0]?.value) {
			return (
				<NetworkButton
					label={supportedNetworks[0]?.label || 'Ethereum'}
					isDisabled
				/>
			);
		}
		return (
			<NetworkButton
				label={'Invalid Network'}
				onClick={(): void => onSwitchChain(supportedNetworks[0].value)}
			/>
		);
	}

	if (!isMounted() || !currentNetwork) {
		<div className={'relative z-50 mr-4'}>
			<div className={'h-10 w-full animate-pulse bg-neutral-100'} />
		</div>;
	}

	return (
		<div className={'relative z-50 ' + (!fullWidth ? ' mr-4' : ' w-full')}>
			<Listbox
				value={safeChainID}
				onChange={(value: unknown): void => onSwitchChain((value as {value: number}).value)}>
				{({open}): ReactElement => (
					<>
						<CurrentNetworkButton
							label={currentNetwork?.label || 'Ethereum'}
							value={currentNetwork?.value || 1}
							isOpen={open}
							fullWidth={fullWidth}
						/>
						<Transition
							appear
							show={open}
							as={Fragment}>
							<div>
								<Transition.Child
									as={Fragment}
									enter={'ease-out duration-300'}
									enterFrom={'opacity-0'}
									enterTo={'opacity-100'}
									leave={'ease-in duration-200'}
									leaveFrom={'opacity-100'}
									leaveTo={'opacity-0'}>
									<div className={'fixed inset-0 bg-neutral-0/60'} />
								</Transition.Child>
								<Transition.Child
									as={Fragment}
									enter={'transition duration-100 ease-out'}
									enterFrom={'transform scale-95 opacity-0'}
									enterTo={'transform scale-100 opacity-100'}
									leave={'transition duration-75 ease-out'}
									leaveFrom={'transform scale-100 opacity-100'}
									leaveTo={'transform scale-95 opacity-0'}>
									<Listbox.Options
										className={
											'absolute  z-50 flex items-center justify-center pt-2 opacity-0 transition-opacity ' +
											(fullWidth ? ' -inset-x-4 ' : ' -inset-x-24 ')
										}>
										<div
											className={
												' border border-neutral-300 bg-neutral-100 p-1 px-2 text-center text-xxs text-neutral-900 ' +
												(fullWidth ? ' w-full ' : ' w-fit ')
											}>
											{supportedNetworks.map(
												(network): ReactElement => (
													<Listbox.Option
														key={network.value}
														value={network}>
														{({active}): ReactElement => (
															<div
																data-active={active}
																className={'yearn--listbox-menu-item text-sm'}>
																{network?.label || 'Ethereum'}
															</div>
														)}
													</Listbox.Option>
												)
											)}
										</div>
									</Listbox.Options>
								</Transition.Child>
							</div>
						</Transition>
					</>
				)}
			</Listbox>
		</div>
	);
}

export function WalletSelector(): ReactElement {
	const {openAccountModal} = useAccountModal();
	const {openChainModal} = useChainModal();
	const {isActive, address, ens, lensProtocolHandle, openLoginModal} = useWeb3();

	const [walletIdentity, set_walletIdentity] = useState<string | undefined>(undefined);
	const isMounted = useIsMounted();

	useEffect((): void => {
		if (!isMounted()) {
			return;
		}
		if (!isActive && address) {
			set_walletIdentity('Invalid Network');
		} else if (ens) {
			set_walletIdentity(ens);
		} else if (lensProtocolHandle) {
			set_walletIdentity(lensProtocolHandle);
		} else if (address) {
			set_walletIdentity(truncateHex(address, 6));
		} else {
			set_walletIdentity(undefined);
		}
	}, [ens, lensProtocolHandle, address, isActive, isMounted]);

	return (
		<div
			onClick={(): void => {
				if (isActive) {
					openAccountModal?.();
				} else if (!isActive && address) {
					openChainModal?.();
				} else {
					openLoginModal();
				}
			}}>
			<div
				suppressHydrationWarning
				className={'font-inter cursor-pointer text-sm font-medium'}>
				{walletIdentity ? (
					walletIdentity
				) : (
					<span>
						<IconWallet className={'yearn--header-nav-item mt-0.5 block h-4 w-4 md:hidden'} />
						<span
							className={
								'relative hidden h-8 cursor-pointer items-center justify-center !rounded-md border border-transparent bg-neutral-900 px-2 text-xs font-normal text-neutral-0 transition-all hover:bg-neutral-800 md:flex'
							}>
							{'Connect wallet'}
						</span>
					</span>
				)}
			</div>
		</div>
	);
}
