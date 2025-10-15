"use client"

import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Button } from '@/components/ui/button'
import { CONTRACT_CONFIG } from '@/contract/abi'
import { formatNumber } from '@/lib/utils'

export function Counter() {
  const { isConnected } = useAccount()
  const [customNumber, setCustomNumber] = useState<string>('')

  // Read current number
  const { data: currentNumber, isLoading: isReading, refetch } = useReadContract({
    ...CONTRACT_CONFIG,
    functionName: 'number',
    query: {
      enabled: isConnected,
    },
  })

  // Write contract hooks
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Refetch data when transaction is successful
  if (isSuccess) {
    refetch()
  }

  const increment = () => {
    writeContract({
      ...CONTRACT_CONFIG,
      functionName: 'increment',
    })
  }

  const decrement = () => {
    writeContract({
      ...CONTRACT_CONFIG,
      functionName: 'decrement',
    })
  }

  const setNumber = () => {
    const num = customNumber.trim()
    if (!num || isNaN(Number(num)) || Number(num) < 0) {
      alert('Please enter a valid positive number')
      return
    }

    writeContract({
      ...CONTRACT_CONFIG,
      functionName: 'setNumber',
      args: [BigInt(num)],
    })
    setCustomNumber('')
  }

  if (!isConnected) {
    return (
      <div className="glass rounded-lg p-8 text-center">
        <p className="text-white text-lg">Please connect your wallet to interact with the counter</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-lg p-8 max-w-md w-full">
      {/* Current Number Display */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Current Number</h2>
        <div className="bg-white/20 rounded-lg p-6">
          {isReading ? (
            <div className="animate-pulse">
              <div className="h-12 bg-white/20 rounded"></div>
            </div>
          ) : (
            <span className="text-4xl font-bold text-white">
              {currentNumber !== undefined ? formatNumber(currentNumber) : '0'}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            onClick={decrement}
            disabled={isPending || isConfirming}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending || isConfirming ? '...' : '- Decrement'}
          </Button>
          <Button
            onClick={increment}
            disabled={isPending || isConfirming}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {isPending || isConfirming ? '...' : '+ Increment'}
          </Button>
        </div>

        {/* Custom Number Input */}
        <div className="border-t border-white/20 pt-4">
          <label className="block text-sm font-medium text-white mb-2">
            Set Custom Number
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={customNumber}
              onChange={(e) => setCustomNumber(e.target.value)}
              placeholder="Enter number"
              min="0"
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={setNumber}
              disabled={isPending || isConfirming || !customNumber.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPending || isConfirming ? '...' : 'Set'}
            </Button>
          </div>
        </div>

        {/* Transaction Status */}
        {isPending && (
          <div className="text-center text-yellow-300">
            <p>Transaction pending...</p>
          </div>
        )}
        {isConfirming && (
          <div className="text-center text-blue-300">
            <p>Waiting for confirmation...</p>
          </div>
        )}
        {isSuccess && (
          <div className="text-center text-green-300">
            <p>Transaction confirmed!</p>
          </div>
        )}
      </div>
    </div>
  )
}
