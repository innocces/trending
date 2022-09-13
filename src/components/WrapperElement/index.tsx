import { Suspense } from 'react'
import type { FC, LazyExoticComponent } from 'react'
import { Spinner, Center } from '@chakra-ui/react'

export type WrapperElementProps = {
  Component: LazyExoticComponent<{
    (): JSX.Element
    displayName?: string
  }>
}

const WrapperElement: FC<WrapperElementProps> = ({ Component }) => {
  return (
    <Suspense
      fallback={
        <Center minH="70vh">
          <Spinner label="loading..." size="lg" color="brand.300" />
        </Center>
      }
    >
      {<Component />}
    </Suspense>
  )
}

WrapperElement.displayName = 'WrapperElement'

export default WrapperElement
