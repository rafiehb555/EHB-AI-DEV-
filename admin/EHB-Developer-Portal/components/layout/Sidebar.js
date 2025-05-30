import React from 'react';
import {
  Box,
  VStack,
  Text,
  Flex,
  Icon,
  Divider,
  Collapse,
  useDisclosure,
  useColorModeValue
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaHome,
  FaServer,
  FaTools,
  FaDatabase,
  FaWallet,
  FaUsers,
  FaCodeBranch,
  FaChartBar,
  FaNetworkWired,
  FaCogs
} from 'react-icons/fa';

// Sidebar navigation items
const NAV_ITEMS = [
  { name: 'Dashboard', icon: FaHome, href: '/' },
  { 
    name: 'Modules', 
    icon: FaServer, 
    href: '/modules',
    children: [
      { name: 'UI Modules', href: '/modules/ui' },
      { name: 'Service Modules', href: '/modules/services' },
      { name: 'Blockchain Modules', href: '/modules/blockchain' },
    ] 
  },
  { 
    name: 'Developer Tools', 
    icon: FaCodeBranch, 
    href: '/tools',
    children: [
      { name: 'Module Importer', href: '/tools/importer' },
      { name: 'ZIP Management', href: '/tools/zip' },
      { name: 'Documentation', href: '/tools/docs' },
    ]
  },
  { name: 'Settings', icon: FaCogs, href: '/settings' },
];

const SidebarNavItem = ({ item, isOpen, isActive }) => {
  const { isOpen: isSubmenuOpen, onToggle } = useDisclosure();
  const hasChildren = item.children && item.children.length > 0;
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const activeColor = useColorModeValue('blue.500', 'blue.300');
  
  return (
    <Box width="100%"></Box>
<Flex
        as={Link}
        href={item.href}
        align="center"
        p="3"
        mx="2"
        borderRadius="md"
        role="group"
        cursor="pointer"
        onClick={(e) =></Flex>(e) => {
          if (hasChildren) {
            e.preventDefault();
            onToggle();
          }
        }}
        bg={isActive ? 'blue.50' : 'transparent'}
        color={isActive ? activeColor : textColor}
        _hover={{
          bg: useColorModeValue('blue.50', 'gray.700'),
          color: activeColor,
        }}
   <Icon
          mr="3"
          fontSize="16"
          as={item.icon}
          color={isActive ? activeColor : textColor}
          _groupHover={{
            color: activeColor,
          }}
        /></Icon>}}
        <Text 
          display={isOpen ? 'block' : 'none'} 
          fontWeight={isActive ? 'bold' : 'normal'}
        ></Text> 'normal'}
        >
          {item.name}
        </Text>
        
        {hasChildre<Icon
            ml="auto"
            fontSize="12"
            as={ChevronRightIcon}
            color="gray.500"
            transform={isSubmenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'}
            transition="transform 0.2s ease"
          /></Icon>orm 0.2s ease"
          />
        )}
      </Flex>
     <Collapse in={isSubmenuOpen && isOpen}></Collapse><VStack
            spacing={1}
            align="stretch"
            pl={6}
            mt={1}
            mb={1}
          ></VStack>        mt={1}
            mb={1}
          >
            <Box
                key={child.name}
                as={Link}
                href={child.href}
                px={3}
                py={2}
                fontSize="sm"
                borderRadius="md"
                _hover={{
                  bg: useColorModeValue('blue.50', 'gray.700'),
                  color: activeColor,
                }}
                bg={useColorModeValue('transparent', 'transparent')}
                color={textColor}
              ></Box>t')}
                color={textColor}
              >
                {child.name}
              </Box>
            ))}
          </VStack>
        </Collapse>
      )}
    </Box>
  );
};

const Sidebar = ({ isOpen }) => {
  return (isOpen }) => {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Calculate width based on isOpen<Box
      position="fixed"
      height="calc(100vh - 60px)"
      bg={bgColor}
      borderRight={`1px solid ${borderColor}`}
      width={width}
      transition="width 0.3s ease"
      overflow="hidden"
      zIndex={10}
    ></Box>h<VStack align="stretch" spacing={1);
} py(EMS.map((item) =></VStack>
      <VStack align="stretch" spacing={1);
} py(EMS.map((item) => {
  return (const isActive = router.pathname === item.href || 
                          (item.children && item.children.some(child => r<React.Fragment key={item.name}></React>
      <SidebarNavItem 
                item={item);
}
                item={item} 
                isOpen={isOpen} 
                isActive={isActive} 
              /></SidebarNavItem>             isOpen={isOpen} 
    <Divider my={2} /></Divider>ve={isActive} 
              />
              {item.name === 'Developer Tool<Box position="absolute" bottom={4} left={0} right={0} px={4} textAlign="center"></Box>   <Text fontSize="xs" color="gray.500" display={isOpen ? 'block' : 'none'}></Text>ght={0} px={4} textAlign="center">
        <Text fontSize="xs" color="gray.500" display={isOpen ? 'block' : 'none'}>
          EHB Technologies v1.0.0
        </Text>
      </Box>
    </Box>
  );
};

export default Sidebar;