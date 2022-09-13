import {
  List,
  ListItem,
  Button,
  useColorModeValue,
  Flex,
  Link,
  Text,
  Avatar,
  Tooltip,
  Box
} from '@chakra-ui/react'
import { StarIcon, CopyIcon } from '@chakra-ui/icons'
import { Book } from 'react-feather'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import type { Repositories } from '@service/trending'
import type { ReactNode, FC } from 'react'
import { useMemo } from 'react'

export type AnimationListProps = {
  list: Repositories
  since: string
}

export type WithIconComponentProps = {
  type: 'star' | 'fork' | 'dot'
  number: ReactNode
  afteron?: ReactNode
  htmlHref: string
  lang: string
}

const WithIconComponent: FC<WithIconComponentProps> = ({
  type,
  number,
  htmlHref,
  afteron = '',
  lang
}) => {
  const href = useMemo<string>(() => {
    const subURIMap: Record<WithIconComponentProps['type'], string> = {
      star: 'stargazers',
      fork: 'network/members',
      dot: '/search?l=' + lang?.toLocaleLowerCase?.()
    }
    return `${htmlHref}/${subURIMap[type]}`
  }, [type, number, htmlHref])

  const IconMap: Record<WithIconComponentProps['type'], ReactNode> = {
    star: <StarIcon />,
    fork: <CopyIcon />,
    dot: <Avatar bgColor="brand.200" title={lang} src="" size="2xs" />
  }

  return (
    <Flex as="a" href={href} target="_blank" alignItems="center">
      {IconMap[type]}
      <Text as="b" px="0.5">
        {number}
      </Text>
      {afteron}
    </Flex>
  )
}

function AnimationList({ list, since }: AnimationListProps) {
  const listBorder = useColorModeValue('gray.100', 'whiteAlpha.200')
  return (
    <List>
      <TransitionGroup>
        {list.map(
          (
            {
              id,
              full_name,
              html_url,
              stargazers_count,
              forks_count,
              starsSince,
              language,
              description,
              builtBy
            },
            index
          ) => (
            <CSSTransition key={id} timeout={500} classNames="fade">
              <ListItem
                borderBottom={`${index !== list.length - 1 ? '1px' : 0} solid`}
                borderBottomColor={listBorder}
              >
                <Link href={html_url!} target="_blank" textDecor="none">
                  <Button
                    variant="ghost"
                    p="4"
                    h="max-content"
                    w="full"
                    alignItems="end"
                    justifyContent="space-between"
                    minH="28"
                  >
                    <Flex
                      flexGrow="1"
                      flexDirection="column"
                      alignItems="start"
                      justifyContent="space-between"
                      w="80%"
                      mr="5%"
                    >
                      <Flex alignItems="center" maxW="full">
                        <Book size={16} />
                        <Text
                          as="b"
                          fontSize="xl"
                          px="2"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {full_name}
                        </Text>
                      </Flex>
                      <Tooltip label={description} hasArrow>
                        <Text
                          as="p"
                          fontSize="md"
                          my="1"
                          color="gray.500"
                          maxW="full"
                          wordBreak="break-all"
                          whiteSpace="normal"
                          textAlign="left"
                        >
                          {description ?? '暂无简介'}
                        </Text>
                      </Tooltip>
                      <Flex alignItems="center" mt="2">
                        <WithIconComponent
                          type="dot"
                          lang={language!}
                          htmlHref={html_url!}
                          number={language!}
                        />
                        <Box px="3">
                          <WithIconComponent
                            type="star"
                            number={stargazers_count}
                            htmlHref={html_url!}
                            lang={language!}
                          />
                        </Box>

                        <WithIconComponent
                          type="fork"
                          number={forks_count}
                          htmlHref={html_url!}
                          lang={language!}
                        />
                      </Flex>
                    </Flex>
                    <Flex flexDirection="column-reverse" flex="1">
                      <WithIconComponent
                        type="star"
                        number={starsSince ?? stargazers_count}
                        htmlHref={html_url!}
                        lang={language!}
                        afteron={since}
                      />
                    </Flex>
                  </Button>
                </Link>
              </ListItem>
            </CSSTransition>
          )
        )}
      </TransitionGroup>
    </List>
  )
}

AnimationList.displayName = 'AnimationList'

export default AnimationList
