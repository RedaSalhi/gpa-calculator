import React from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');

export const ThemeSwitcher = ({ visible, onClose }) => {
  const { theme, currentTheme, changeTheme, getAllThemes } = useTheme();

  const handleThemeSelect = (themeName) => {
    changeTheme(themeName);
    onClose();
  };

  const renderThemePreview = (themeData) => {
    const isSelected = currentTheme === themeData.name;
    
    return (
      <TouchableOpacity
        key={themeData.name}
        style={[
          styles.themeCard,
          {
            backgroundColor: themeData.colors.card,
            borderColor: isSelected ? themeData.colors.primary : themeData.colors.cardBorder,
            borderWidth: isSelected ? 3 : 1,
          },
        ]}
        onPress={() => handleThemeSelect(themeData.name)}
      >
        <View style={styles.themeHeader}>
          <Text
            style={[
              styles.themeName,
              { color: themeData.colors.text },
            ]}
          >
            {themeData.displayName}
          </Text>
          {isSelected && (
            <View
              style={[
                styles.selectedIndicator,
                { backgroundColor: themeData.colors.primary },
              ]}
            />
          )}
        </View>
        
        <View style={styles.colorPreview}>
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: themeData.colors.primary },
            ]}
          />
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: themeData.colors.secondary },
            ]}
          />
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: themeData.colors.accent },
            ]}
          />
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: themeData.colors.success },
            ]}
          />
        </View>
        
        <View style={styles.previewElements}>
          <View
            style={[
              styles.previewButton,
              { backgroundColor: themeData.colors.button },
            ]}
          >
            <Text
              style={[
                styles.previewButtonText,
                { color: themeData.colors.buttonText },
              ]}
            >
              Button
            </Text>
          </View>
          <View
            style={[
              styles.previewInput,
              {
                backgroundColor: themeData.colors.input,
                borderColor: themeData.colors.inputBorder,
              },
            ]}
          >
            <Text style={[styles.previewInputText, { color: themeData.colors.textSecondary }]}>
              Input
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.modalTitle,
                { color: theme.colors.text },
              ]}
            >
              Choose Theme
            </Text>
            <TouchableOpacity
              style={[
                styles.closeButton,
                { backgroundColor: theme.colors.error },
              ]}
              onPress={onClose}
            >
              <Text style={[styles.closeButtonText, { color: theme.colors.buttonText }]}>
                ×
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.themesList} showsVerticalScrollIndicator={false}>
            {getAllThemes().map(renderThemePreview)}
          </ScrollView>
          
          <View style={styles.footer}>
            <Text
              style={[
                styles.footerText,
                { color: theme.colors.textSecondary },
              ]}
            >
              Tap a theme to apply it instantly
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 16,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  themesList: {
    padding: 16,
  },
  themeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  themeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  colorPreview: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  previewElements: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  previewButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  previewInput: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
  },
  previewInputText: {
    fontSize: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
}); 