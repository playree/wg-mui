'use client'

import { Button } from '@heroui/button'
import { useState } from 'react'

export const Counter = () => {
  const [count, setCount] = useState(0)

  return (
    <Button radius='full' onPress={() => setCount(count + 1)}>
      Count is {count}
    </Button>
  )
}
