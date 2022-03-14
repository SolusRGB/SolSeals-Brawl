import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Heading, VStack, HStack, Text, Code } from "@chakra-ui/react";

// const FLIP_PUBLIC_KEY = "EtCvhfpwvaUVD4uh13NaYxtGddDcDkyYXsomtwXGHyB7";

export const Transactions = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = useState(null);
  useEffect(() => {
    const getTransactions = async () => {
      const transactions = await connection.getConfirmedSignaturesForAddress2(
        publicKey,
        {
          limit: 10,
        }
      );
      setTransactions(transactions);
    };

    if (publicKey) {
      getTransactions();
    }
  }, [publicKey, connection]);

  return (
    <>
      <Heading>My Flips</Heading>
      {transactions && (
        <VStack>
          {transactions.map((v, i, arr) => (
            <HStack key={"transaction-" + i}>
              <Text>Signature: </Text>
              <Code>{v.signature}</Code>
            </HStack>
          ))}
        </VStack>
      )}
    </>
  );
};
