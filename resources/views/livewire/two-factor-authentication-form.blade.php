<x-action-section>
    <x-slot name="title">
        {{ __('Two Factor Authentication') }}
    </x-slot>

    <x-slot name="description">
        {{ __('Add additional security to your account using two factor authentication.') }}
    </x-slot>

    <x-slot name="content">
        <h3 class="text-lg font-medium text-gray-900">
            @if ($enabled)
                {{ __('You have enabled two factor authentication.') }}
            @else
                {{ __('You have not enabled two factor authentication.') }}
            @endif
        </h3>

        <div class="mt-5">
            @if ($enabled)
                <div>
                    <h4 class="text-md font-medium text-gray-800">{{ __('Recovery Codes') }}</h4>
                    <p class="mt-1 text-sm text-gray-600">
                        {{ __('Store these recovery codes in a safe place. They can be used to access your account if you lose your two factor authentication device.') }}
                    </p>
                    <div class="mt-2">
                        <textarea readonly class="border border-gray-300 rounded-md w-full p-2" rows="5">{{ $recoveryCodes }}</textarea>
                    </div>
                </div>

                <div class="mt-5">
                    <x-button wire:click="regenerateRecoveryCodes">
                        {{ __('Regenerate Recovery Codes') }}
                    </x-button>
                </div>

                <div class="mt-5">
                    <x-button wire:click="disableTwoFactorAuthentication" class="bg-red-600 hover:bg-red-700">
                        {{ __('Disable Two Factor Authentication') }}
                    </x-button>
                </div>
            @else
                <div>
                    <x-button wire:click="enableTwoFactorAuthentication">
                        {{ __('Enable Two Factor Authentication') }}
                    </x-button>
                </div>
            @endif
        </div>

        @if ($showingConfirmation)
            <div class="mt-5">
                <h4 class="text-md font-medium text-gray-800">{{ __('Confirm Two Factor Authentication') }}</h4>
                <p class="mt-1 text-sm text-gray-600">
                    {{ __('Please enter the code from your authentication app.') }}
                </p>
                <div class="mt-2">
                    <x-input type="text" wire:model.defer="code" class="mt-1 block w-full" />
                    <x-input-error for="code" class="mt-2" />
                </div>
                <div class="mt-5">
                    <x-button wire:click="confirmTwoFactorAuthentication">
                        {{ __('Confirm') }}
                    </x-button>
                </div>
            </div>
        @endif
    </x-slot>
</x-action-section>