import { useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import {
  Box,
  Flex,
  Center,
  Avatar,
  Button,
  useColorMode,
  useToast,
  Container,
  Text
} from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { GitHub } from 'react-feather'

import SettingPanel from '@components/SettingPanel/index'

import './index.less'

const Logo = () => (
  <Link to="/">
    <Avatar h="7" w="7" size="sm" src="/dog.jpeg" loading="lazy" />
  </Link>
)

const BasicLayout = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const toast = useToast()

  useEffect(() => {
    toast.closeAll()
    toast({
      description: `use ${colorMode} colorMode!`,
      isClosable: true,
      variant: 'left-accent'
    })
  }, [colorMode])

  return (
    <Box pos="absolute" w="full" h="full">
      <Box boxShadow="lg" minW="sm" h="62px" p="16px">
        <Flex flex="1" alignItems="center" justifyContent="space-between">
          <Flex flexGrow="1">
            <Logo />
          </Flex>
          <Button onClick={toggleColorMode} variant="ghost" size="sm">
            {colorMode === 'light' ? (
              <SunIcon fontSize="24" />
            ) : (
              <MoonIcon fontSize="24" />
            )}
          </Button>
          <Link to="//github.com/trending" target="_blank">
            <Center>
              <Button variant="ghost" size="sm">
                <GitHub />
              </Button>
            </Center>
          </Link>
          <SettingPanel />
        </Flex>
      </Box>
      <Box minW="sm" minH="calc(100vh - 94px - var(--chakra-space-8) * 2)">
        <Outlet />
      </Box>
      <Container maxW="lg" py="8">
        <Center>
          <Logo />{' '}
          <Text ml="1" color="gray.200">
            © {new Date().getFullYear()} Trending, Inc.
          </Text>
        </Center>
      </Container>
    </Box>
  )
}

BasicLayout.displayName = 'BasicLayout'

export default BasicLayout
