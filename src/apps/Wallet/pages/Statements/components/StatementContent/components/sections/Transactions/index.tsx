import TransactionList from './components/TransactionList'
import TransactionsSummary from './components/TransactionsSummary'

function Transactions({ month, year }: { month: number; year: number }) {
  return (
    <>
      <h2 className="mt-16 text-3xl font-semibold uppercase tracking-widest">
        <span className="text-custom-500 print:text-lime-600">02. </span>
        Transactions
      </h2>
      <TransactionsSummary month={month} year={year} />
      {['income', 'expenses', 'transfer'].map(type => (
        <TransactionList
          key={type}
          month={month}
          type={type as 'income' | 'expenses' | 'transfer'}
          year={year}
        />
      ))}
    </>
  )
}

export default Transactions
