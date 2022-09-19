import {
  Menu,
  MenuItemOption,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuDivider,
  Text,
  Box,
  Button
} from '@chakra-ui/react'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { FixedSizeList } from 'react-window'
import type { Item } from '@/type'

export type CustomMenuProps = {
  desc?: ReactNode
  value?: string
  valueLabel?: ReactNode
  option: Item[]
  autoHeight?: boolean
  onChange?: (value: string) => void
  loading?: boolean
  disabled?: boolean
}

const CustomMenu: FC<CustomMenuProps> = ({
  desc,
  value,
  valueLabel,
  option,
  onChange,
  autoHeight,
  loading,
  disabled
}) => {
  const [controlValue, setControlValue] = useState<string>(value ?? '')

  useEffect(() => {
    !controlValue && setControlValue(value!)
  }, [controlValue, value])

  const handleChange = (chooseValue: string) => {
    setControlValue(chooseValue)
    onChange?.(chooseValue)
  }

  const selectedLabel = useMemo<string>(() => {
    return option.find((v) => v.value === controlValue)?.label ?? 'unknown'
  }, [option, controlValue])

  return (
    <Menu autoSelect={!value}>
      <MenuButton
        as={Button}
        variant="ghost"
        size="sm"
        isLoading={loading}
        disabled={disabled}
      >
        {valueLabel} {selectedLabel}
      </MenuButton>
      <MenuList maxH={autoHeight ? 'max-content' : '300px'} overflow="auto">
        {desc ? (
          <Box paddingInline="3">
            <Text as="b">{desc}</Text>
            <MenuDivider />
          </Box>
        ) : null}
        <MenuOptionGroup value={controlValue} type="radio">
          {autoHeight ? (
            option.map(({ value, label }, index) => (
              <MenuItemOption
                key={value + '-' + index}
                value={value}
                onClick={() => handleChange(value)}
              >
                {label}
              </MenuItemOption>
            ))
          ) : (
            <FixedSizeList
              height={282 - (desc ? 41 : 0)}
              width="100%"
              itemSize={37}
              itemCount={option?.length}
              itemData={option}
            >
              {({ index, style }) => {
                const { value, label } = option[index]
                return (
                  <MenuItemOption
                    key={value + '-' + index}
                    value={value}
                    onClick={() => handleChange(value)}
                    style={style}
                    isChecked={value === controlValue}
                  >
                    {label}
                  </MenuItemOption>
                )
              }}
            </FixedSizeList>
          )}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}

CustomMenu.displayName = 'CustomMenu'

export default CustomMenu
