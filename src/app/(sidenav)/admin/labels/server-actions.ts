'use server'

import { AllOrCount, prisma } from '@/helpers/prisma'
import { EditLabel } from '@/helpers/schema'

export const getLabelList = async (withUser?: AllOrCount) => {
  console.debug('getLabelList:in:')
  const lablelList = await prisma.label.getAllList(withUser)
  console.debug('getLabelList:out:', lablelList.length)
  return lablelList
}

export const createLabel = async (data: EditLabel) => {
  console.debug('createLabel:in:', data)
  const lablel = await prisma.label.create({ data })
  console.debug('createLabel:out:', lablel)
  return lablel
}

export const updateLabel = async (id: string, data: EditLabel) => {
  console.debug('updateLabel:in:', data)
  const lablel = await prisma.label.update({ where: { id }, data })
  console.debug('updateLabel:out:', lablel)
  return lablel
}

export const deleteLabel = async (id: string) => {
  console.debug('deleteLabel:in:', id)
  await prisma.label.delete({ where: { id } })
  console.debug('deleteLabel:out:')
  return
}

export const existsLabelName = async (name: string) => {
  console.debug('existsLabelName:in:', name)
  const label = await prisma.label.findUnique({ where: { name } })
  const exists = !!label
  console.debug('existsLabelName:out:', exists)
  return exists
}
