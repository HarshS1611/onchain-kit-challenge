"use client";
import styles from "./page.module.css";
import { Wallet, useGetETHBalance } from "@coinbase/onchainkit/wallet";
import { useAccount } from "wagmi";
import { Counter } from "./components/Counter";

export default function Home() {
  const { address,isConnected } = useAccount();
  const { roundedBalance } = useGetETHBalance(address)

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet />
      </header>

      <div className="mx-auto">

        <h1 className={styles.title}>Counter Contract </h1>
        <div className="">{isConnected ? `Connected wallet : ${address}` : `Not Connected`}</div>
        <div>ETH Balance: {isConnected ? Number(roundedBalance).toFixed(3) : 0} ETH</div>
        <Counter />

      </div>
    </div>
  );
}
