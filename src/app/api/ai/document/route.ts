export async function POST(req: Request) {
  const post = await req.json()
  const keyWord = post.data
  const stream = await fetch(`http://172.16.180.215:8014/myplus-qing/ug/ai/gc/document/friend?text=${keyWord}`, {
    method: 'POST'
  })
  console.log(stream)
  // return new Response(stream)
}

// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream

// function iteratorToStream(iterator: any) {
//   return new ReadableStream({
//     async pull(controller) {
//       const { value, done } = await iterator.next()

//       if (done) {
//         controller.close()
//       } else {
//         controller.enqueue(value)
//       }
//     }
//   })
// }

// function sleep(time: number) {
//   return new Promise(resolve => {
//     setTimeout(resolve, time)
//   })
// }

// const encoder = new TextEncoder()

// async function* makeIterator() {
//   yield encoder.encode('<p>One</p>')
//   await sleep(200)
//   yield encoder.encode('<p>Two</p>')
//   await sleep(200)
//   yield encoder.encode('<p>Three</p>')
// }

// export async function GET() {
//   const iterator = makeIterator()
//   const stream = iteratorToStream(iterator)

//   return new Response(stream)
// }
