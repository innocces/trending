import { useState, useCallback, useEffect } from 'react'
import {
  Container,
  Center,
  Text,
  Flex,
  Box,
  useColorModeValue,
  Button,
  useToast,
  Spinner
} from '@chakra-ui/react'
import AnimationList from '@components/AnimationList/index'
import CustomMenu from '@components/CustomMenu/index'

import { getLanguage, getSpokenLanguage } from '@service/resources'
import { getRepositories } from '@service/trending'
import type { Repositories } from '@service/trending'
import type { Item } from '@/type'
import { DATERANGE, SEARCHTYPE } from '@const/condition'
import { STORAGEKEY } from '@const/storage'
import { getItem, addListener } from '@/utils/storage'
import type { Setting } from '@components/SettingPanel/index'

export type Condition = {
  lang?: string
  spoken_language_code?: string
  since: string
}

const INITCONDITION: Condition = {
  lang: undefined,
  spoken_language_code: undefined,
  since: DATERANGE[0].value
}

function Home() {
  const [loading, setLoading] = useState<boolean>(true)
  const [spokenLang, setSpokenLang] = useState<Item[]>([])
  const [language, setLanguage] = useState<Item[]>([])
  const [condition, setCondition] = useState<Condition>(INITCONDITION)
  const [searchType, setSearchType] = useState<string>(SEARCHTYPE[0].value)
  const [list, setList] = useState<Repositories>([])
  const [trending, setTrending] = useState<boolean>(
    getItem<Setting>(STORAGEKEY, {})?.useTrending ?? false
  )

  // theme
  const cardBackground = useColorModeValue('gray.50', 'blackAlpha.300')
  const listBorder = useColorModeValue('gray.100', 'whiteAlpha.200')
  const toast = useToast()

  const fetchResource = useCallback(() => {
    return Promise.all([getLanguage(), getSpokenLanguage()]).then(
      ([languageResources, spokenLangResources]) => {
        setLanguage(languageResources)
        setSpokenLang(spokenLangResources)
      }
    )
  }, [])

  const fetchRepositories = useCallback(async () => {
    setLoading(true)
    setList([])
    try {
      const response = await getRepositories(condition)
      setList(response)
    } catch (e) {
      console.log(e)
      toast({
        title: '获取仓库信息失败, 请重试!',
        status: 'error'
      })
    }
    setLoading(false)
  }, [condition])

  useEffect(() => {
    fetchResource()
    addListener<Setting>(STORAGEKEY, (value) =>
      setTrending(value.useTrending ?? false)
    )
  }, [])

  useEffect(() => {
    fetchRepositories()
  }, [condition])

  return (
    <>
      <Container
        minW="100vw"
        h="163"
        borderBottom="1px"
        borderBottomColor="blackAlpha.50"
        bg={cardBackground}
      >
        <Center h="100%" alignItems="center" flexDirection="column">
          <Text
            as="b"
            fontSize="3xl"
            bgGradient="linear(to-l, purple.300, purple.200)"
            bgClip="text"
          >
            Trending
          </Text>
          <Text
            fontSize="xl"
            bgGradient="linear(to-r, gray.500, gray.300)"
            bgClip="text"
          >
            See what the GitHub community is most excited about today.
          </Text>
        </Center>
      </Container>
      <Container
        maxW="container.lg"
        borderRadius="6px"
        border="1px"
        borderColor={listBorder}
        mt="10"
        p="0"
        boxShadow="xl"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bg={cardBackground}
          p="4"
          flexDirection={{ sm: 'row', base: 'column' }}
        >
          <Flex flex="1">
            {SEARCHTYPE.map(({ label, value }, index) => (
              <Button
                size="sm"
                aria-valuetext={value}
                key={value}
                variant={value === searchType ? 'solid' : 'outline'}
                onClick={() => setSearchType(value)}
                borderRightRadius={!index ? 0 : 'md'}
                borderLeftRadius={index ? 0 : 'md'}
                isLoading={loading}
              >
                {label}
              </Button>
            ))}
          </Flex>
          <CustomMenu
            value={condition.lang}
            valueLabel="Language:"
            desc="Select a language"
            option={language}
            onChange={(lang) => setCondition({ ...condition, lang })}
            loading={loading}
          />
          <CustomMenu
            value={condition.spoken_language_code}
            valueLabel="Spoken Language:"
            desc="Select a spoken language"
            option={spokenLang}
            onChange={(spoken_language_code) =>
              setCondition({ ...condition, spoken_language_code })
            }
            loading={loading}
            disabled={!trending}
          />
          <CustomMenu
            value={condition.since}
            valueLabel="Date range:"
            desc="Adjust time span"
            onChange={(since) => setCondition({ ...condition, since })}
            option={DATERANGE}
            autoHeight
            loading={loading}
          />
        </Box>
        {loading && (
          <Center h="50vh">
            <Spinner label="loading..." size="lg" color="brand.300" />
          </Center>
        )}
        {!loading && list.length ? (
          <AnimationList since={condition.since} list={list} />
        ) : (
          <Center h="50vh">
            <Button variant="ghost">暂无数据</Button>
          </Center>
        )}
      </Container>
    </>
  )
}

Home.displayName = 'Home'

export default Home
