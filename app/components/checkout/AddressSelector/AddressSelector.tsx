// src/app/components/checkout/AddressSelector/AddressSelector.tsx
'use client';

import React from 'react';
import { Address } from '@/app/types/address.types';

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  onAddNewAddress: () => void;
}

export function AddressSelector({
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddNewAddress,
}: AddressSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Shipping Address</h3>
      
      <div className="space-y-3">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedAddress?.id === address.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectAddress(address)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium capitalize">{address.type}</span>
                  {address.isDefault && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-gray-700">
                  {address.street}
                  {address.apartment && `, ${address.apartment}`}
                </p>
                <p className="text-gray-600">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-gray-600">{address.country}</p>
              </div>
              <input
                type="radio"
                name="shipping-address"
                checked={selectedAddress?.id === address.id}
                onChange={() => onSelectAddress(address)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAddNewAddress}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
      >
        + Add New Address
      </button>
    </div>
  );
}