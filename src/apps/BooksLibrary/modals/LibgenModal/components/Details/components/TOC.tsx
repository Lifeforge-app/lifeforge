import { BookDetailProps } from '..'

function TOC({ data }: { data: BookDetailProps }) {
  return (
    <>
      {Object.entries({
        descriptions: 'Descriptions',
        toc: 'Table of Contents'
      }).map(
        ([key, value]) =>
          Boolean(data[key]) && (
            <div key={key}>
              <h2 className="mt-6 mb-3 text-2xl font-semibold">{value}</h2>
              <div
                className="font-light"
                dangerouslySetInnerHTML={{
                  __html: data[key].replace(/^<br>/, '')
                }}
              />
            </div>
          )
      )}
    </>
  )
}

export default TOC
