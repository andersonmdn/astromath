interface PreparationRule {
  color: 'blue' | 'green' | 'black' | 'red'
  name: string
  description: string
  need_neighbor: boolean
  group: number
  quantity: number
}

export default PreparationRule
