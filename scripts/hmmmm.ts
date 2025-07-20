import Pocketbase from 'pocketbase'

const pb = new Pocketbase('http://127.0.0.1:8090')

try {
  await pb
    .collection('_superusers')
    .authWithPassword('melvinchia623600@gmail.com', ',jBqUP@-d*78BmP')

  if (!pb.authStore.isSuperuser || !pb.authStore.isValid) {
    console.error('Invalid credentials.')
    process.exit(1)
  }
} catch {
  console.error('Invalid credentials.')
  process.exit(1)
}

const allTransactions = await pb
  .collection('wallet__transactions_income_expenses')
  .getFullList()

for (let i = 0; i < allTransactions.length; i++) {
  const tx = allTransactions[i]

  if (tx.type === 'expense') {
    await pb.collection('wallet__transactions_income_expenses').update(tx.id, {
      type: 'expenses'
    })
  }
}
