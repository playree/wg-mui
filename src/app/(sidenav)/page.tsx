import { subtitle, title } from '@/components/primitives'
import { Code } from '@nextui-org/code'
import { Snippet } from '@nextui-org/snippet'

export default function Home() {
  return (
    <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
      <div className='inline-block max-w-lg justify-center text-center'>
        <h1 className={title()}>Make&nbsp;</h1>
        <h1 className={title({ color: 'violet' })}>beautiful&nbsp;</h1>
        <br />
        <h1 className={title()}>websites regardless of your design experience.</h1>
        <h2 className={subtitle({ class: 'mt-4' })}>Beautiful, fast and modern React UI library.</h2>
      </div>

      <div className='mt-8'>
        <Snippet hideSymbol hideCopyButton variant='flat'>
          <span>
            Get started by editing <Code color='primary'>app/page.tsx</Code>
          </span>
        </Snippet>
      </div>
    </section>
  )
}
