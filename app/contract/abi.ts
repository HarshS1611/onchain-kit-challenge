import { Address } from 'viem'

export const COUNTER_ABI = [
  {
    type: 'function',
    name: 'decrement',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'increment',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'number',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setNumber',
    inputs: [
      {
        name: 'newNumber',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

export const COUNTER_ADDRESS: Address = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address);

export const CONTRACT_CONFIG = {
  address: COUNTER_ADDRESS,
  abi: COUNTER_ABI,
} as const
