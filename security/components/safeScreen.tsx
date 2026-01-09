import React, { ReactNode } from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface SafeScreenProps {
  children: ReactNode
  backgroundColor?: string
  barStyle?: 'light-content' | 'dark-content'
}

const SafeScreen: React.FC<SafeScreenProps> = ({
  children,
  backgroundColor = '#0f172a',
  barStyle = 'light-content',
}) => {
  const insets = useSafeAreaInsets()

  return (
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />

      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            backgroundColor,
          },
        ]}
      >
        {children}
      </View>
    </>
  )
}

export default SafeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
