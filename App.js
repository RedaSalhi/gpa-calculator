import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    AppRegistry,
    Modal,
    SafeAreaView,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ThemedButton } from './components/ui/ThemedButton';
import { ThemeProvider, useTheme } from './hooks/useTheme';

const AppContent = () => {
  const { theme, currentTheme } = useTheme();
  
  const [semesters, setSemesters] = useState([]);
  const [currentSemester, setCurrentSemester] = useState(0);
  const [courseName, setCourseName] = useState('');
  const [grade, setGrade] = useState('');
  const [credits, setCredits] = useState('');
  const [gradingSystem, setGradingSystem] = useState('US');
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [targetGPA, setTargetGPA] = useState('');
  const [targetCredits, setTargetCredits] = useState('');
  const [newSemesterName, setNewSemesterName] = useState('');
  const [editingSemesterIndex, setEditingSemesterIndex] = useState(null);
  const [editingSemesterName, setEditingSemesterName] = useState('');
  const [showEditSemesterModal, setShowEditSemesterModal] = useState(false);

  // Grading systems
  const gradingSystems = {
    US: {
      name: 'US (4.0 Scale)',
      grades: {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'F': 0.0
      }
    },
    ECTS: {
      name: 'ECTS European',
      grades: {
        'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'E': 0.5, 'F': 0.0
      }
    },
    UK: {
      name: 'UK Classification',
      grades: {
        'First': 4.0, '2:1': 3.3, '2:2': 2.7, 'Third': 2.0, 'Pass': 1.0, 'Fail': 0.0
      }
    },
    Percentage: {
      name: 'Percentage (100 Scale)',
      grades: {
        '90-100': 4.0, '80-89': 3.0, '70-79': 2.0, '60-69': 1.0, '0-59': 0.0
      }
    }
  };

  // Load data on app start
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever semesters change
  useEffect(() => {
    saveData();
  }, [semesters, gradingSystem]);

  const loadData = async () => {
    try {
      const savedSemesters = await AsyncStorage.getItem('semesters');
      const savedGradingSystem = await AsyncStorage.getItem('gradingSystem');
      
      if (savedSemesters) {
        const parsedSemesters = JSON.parse(savedSemesters);
        setSemesters(parsedSemesters.length > 0 ? parsedSemesters : [createNewSemester('Fall 2024')]);
      } else {
        setSemesters([createNewSemester('Fall 2024')]);
      }
      
      if (savedGradingSystem) {
        setGradingSystem(savedGradingSystem);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setSemesters([createNewSemester('Fall 2024')]);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('semesters', JSON.stringify(semesters));
      await AsyncStorage.setItem('gradingSystem', gradingSystem);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const createNewSemester = (name) => ({
    id: Date.now(),
    name,
    courses: []
  });

  const addSemester = () => {
    if (!newSemesterName.trim()) {
      Alert.alert('Error', 'Please enter a semester name');
      return;
    }
    
    const newSemester = createNewSemester(newSemesterName.trim());
    setSemesters([...semesters, newSemester]);
    setCurrentSemester(semesters.length);
    setNewSemesterName('');
    setShowSemesterModal(false);
  };

  const deleteSemester = (semesterIndex) => {
    if (semesters.length === 1) {
      Alert.alert('Error', 'You must have at least one semester');
      return;
    }

    Alert.alert(
      'Delete Semester',
      `Are you sure you want to delete "${semesters[semesterIndex].name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            const newSemesters = semesters.filter((_, index) => index !== semesterIndex);
            setSemesters(newSemesters);
            setCurrentSemester(Math.max(0, Math.min(currentSemester, newSemesters.length - 1)));
          }
        }
      ]
    );
  };

  const addCourse = () => {
    if (!courseName.trim() || !grade.trim() || !credits.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const currentGradeSystem = gradingSystems[gradingSystem];
    const gradeUpper = grade.toUpperCase();
    
    if (!currentGradeSystem.grades.hasOwnProperty(gradeUpper)) {
      const validGrades = Object.keys(currentGradeSystem.grades).join(', ');
      Alert.alert('Error', `Invalid grade for ${currentGradeSystem.name}. Valid grades: ${validGrades}`);
      return;
    }

    const creditNum = parseFloat(credits);
    if (isNaN(creditNum) || creditNum <= 0) {
      Alert.alert('Error', 'Credits must be a positive number');
      return;
    }

    const newCourse = {
      id: Date.now(),
      name: courseName.trim(),
      grade: gradeUpper,
      credits: creditNum,
      gpaValue: currentGradeSystem.grades[gradeUpper]
    };

    const updatedSemesters = [...semesters];
    updatedSemesters[currentSemester].courses.push(newCourse);
    setSemesters(updatedSemesters);
    
    setCourseName('');
    setGrade('');
    setCredits('');
  };

  const removeCourse = (courseId) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[currentSemester].courses = updatedSemesters[currentSemester].courses.filter(
      course => course.id !== courseId
    );
    setSemesters(updatedSemesters);
  };

  const calculateSemesterGPA = (semester) => {
    if (semester.courses.length === 0) return 0;
    
    const totalPoints = semester.courses.reduce((sum, course) => 
      sum + (course.gpaValue * course.credits), 0);
    const totalCredits = semester.courses.reduce((sum, course) => 
      sum + course.credits, 0);
    
    return totalPoints / totalCredits;
  };

  const calculateCumulativeGPA = () => {
    if (semesters.length === 0) return 0;
    
    const totalPoints = semesters.reduce((sum, semester) => 
      sum + (calculateSemesterGPA(semester) * semester.courses.reduce((credits, course) => 
        credits + course.credits, 0)), 0);
    const totalCredits = getTotalCredits();
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const getTotalCredits = () => {
    return semesters.reduce((sum, semester) => 
      sum + semester.courses.reduce((credits, course) => credits + course.credits, 0), 0);
  };

  const calculateTargetGPA = () => {
    const currentGPA = calculateCumulativeGPA();
    const currentCredits = getTotalCredits();
    const targetGPAValue = parseFloat(targetGPA);
    const targetCreditsValue = parseFloat(targetCredits);
    
    if (isNaN(targetGPAValue) || isNaN(targetCreditsValue) || targetCreditsValue <= 0) {
      Alert.alert('Error', 'Please enter valid target GPA and credits');
      return;
    }
    
    const requiredGPA = ((targetGPAValue * (currentCredits + targetCreditsValue)) - (currentGPA * currentCredits)) / targetCreditsValue;
    
    if (requiredGPA > 4.0) {
      Alert.alert(
        'Target Unachievable',
        `To reach a ${targetGPAValue} GPA with ${targetCreditsValue} additional credits, you would need a ${requiredGPA.toFixed(2)} GPA, which is above the maximum 4.0.`
      );
    } else if (requiredGPA < 0) {
      Alert.alert(
        'Target Already Achieved',
        `You already have a ${currentGPA.toFixed(2)} GPA with ${currentCredits} credits. Adding ${targetCreditsValue} credits with a 0.0 GPA would still give you a ${((currentGPA * currentCredits) / (currentCredits + targetCreditsValue)).toFixed(2)} GPA.`
      );
    } else {
      Alert.alert(
        'Required GPA',
        `To reach a ${targetGPAValue} GPA with ${targetCreditsValue} additional credits, you need to maintain a ${requiredGPA.toFixed(2)} GPA in your remaining courses.`
      );
    }
    
    setTargetGPA('');
    setTargetCredits('');
    setShowTargetModal(false);
  };

  const exportData = async () => {
    try {
      const data = {
        semesters,
        gradingSystem,
        cumulativeGPA: calculateCumulativeGPA(),
        totalCredits: getTotalCredits(),
        exportDate: new Date().toISOString()
      };
      
      const message = `GPA Calculator Data\n\nCumulative GPA: ${data.cumulativeGPA.toFixed(2)}\nTotal Credits: ${data.totalCredits.toFixed(1)}\n\nSemesters:\n${semesters.map(semester => 
        `${semester.name} - GPA: ${calculateSemesterGPA(semester).toFixed(2)}\n${semester.courses.map(course => 
          `  ${course.name}: ${course.grade} (${course.credits} credits)`
        ).join('\n')}`
      ).join('\n\n')}`;
      
      await Share.share({
        message,
        title: 'GPA Calculator Data'
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all semesters and courses? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive', 
          onPress: () => {
            setSemesters([createNewSemester('Fall 2024')]);
            setCurrentSemester(0);
            setCourseName('');
            setGrade('');
            setCredits('');
          }
        }
      ]
    );
  };

  const currentSemesterData = semesters[currentSemester] || { courses: [], name: '' };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={theme.colors.background === '#121212' ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.primary} 
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.buttonText }]}>GPA Calculator</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={() => setShowGradingModal(true)} 
            style={[styles.headerButton, { backgroundColor: theme.colors.secondary }]}
          >
            <Text style={[styles.headerButtonText, { color: theme.colors.buttonText }]}>{gradingSystem}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={exportData} 
            style={[styles.headerButton, { backgroundColor: theme.colors.secondary }]}
          >
            <Text style={[styles.headerButtonText, { color: theme.colors.buttonText }]}>Export</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Overall GPA Display */}
        <View style={styles.overallGpaSection}>
          <View style={[styles.gpaCard, { 
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.cardBorder,
            borderWidth: 1,
          }]}>
            <Text style={[styles.gpaLabel, { color: theme.colors.text }]}>Cumulative GPA</Text>
            <Text style={[styles.gpaValue, { color: theme.colors.primary }]}>
              {calculateCumulativeGPA().toFixed(2)}
            </Text>
            <Text style={[styles.creditsText, { color: theme.colors.textSecondary }]}>
              Total Credits: {getTotalCredits().toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Semester Navigation */}
        <View style={styles.semesterNav}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {semesters.map((semester, index) => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  key={semester.id}
                  style={[
                    styles.semesterTab,
                    { backgroundColor: theme.colors.card },
                    currentSemester === index && { backgroundColor: theme.colors.primary }
                  ]}
                  onPress={() => {
                    setEditingSemesterIndex(index);
                    setEditingSemesterName(semesters[index].name);
                    setShowEditSemesterModal(true);
                  }}
                >
                  <Text style={[
                    styles.semesterTabText,
                    { color: currentSemester === index ? theme.colors.buttonText : theme.colors.text }
                  ]}>
                    {semester.name}
                  </Text>
                  <Text style={[
                    styles.semesterGpaText,
                    { color: currentSemester === index ? theme.colors.buttonText : theme.colors.textSecondary }
                  ]}>
                    {calculateSemesterGPA(semester).toFixed(2)}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.addSemesterTab, { backgroundColor: theme.colors.accent }]}
              onPress={() => setShowSemesterModal(true)}
            >
              <Text style={[styles.addSemesterText, { color: theme.colors.buttonText }]}>+ Add</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Current Semester GPA */}
        <View style={[styles.currentSemesterGpa, { 
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          borderWidth: 1,
        }]}>
          <Text style={[styles.currentSemesterTitle, { color: theme.colors.text }]}>
            {currentSemesterData.name} - GPA: {calculateSemesterGPA(currentSemesterData).toFixed(2)}
          </Text>
        </View>

        {/* Input Section */}
        <View style={[styles.inputSection, { 
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          borderWidth: 1,
        }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Add Course</Text>
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.input,
              borderColor: theme.colors.inputBorder,
              color: theme.colors.text,
            }]}
            placeholder="Course Name"
            value={courseName}
            onChangeText={setCourseName}
            placeholderTextColor={theme.colors.textSecondary}
          />
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.input,
              borderColor: theme.colors.inputBorder,
              color: theme.colors.text,
            }]}
            placeholder={`Grade (${Object.keys(gradingSystems[gradingSystem].grades).slice(0, 3).join(', ')}, etc.)`}
            value={grade}
            onChangeText={setGrade}
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="characters"
          />
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.input,
              borderColor: theme.colors.inputBorder,
              color: theme.colors.text,
            }]}
            placeholder="Credit Hours"
            value={credits}
            onChangeText={setCredits}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textSecondary}
          />
          
          <ThemedButton type="success" onPress={addCourse}>Add Course</ThemedButton>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <ThemedButton type="primary" onPress={() => setShowTargetModal(true)}>Target GPA</ThemedButton>
          <ThemedButton type="error" onPress={clearAllData}>Clear All</ThemedButton>
        </View>

        {/* Courses List */}
        <View style={[styles.coursesSection, { 
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          borderWidth: 1,
        }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Courses ({currentSemesterData.courses.length})
          </Text>

          {currentSemesterData.courses.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No courses in this semester</Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>Add your first course above</Text>
            </View>
          ) : (
            currentSemesterData.courses.map((course) => (
              <View key={course.id} style={[styles.courseCard, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderWidth: 1,
              }]}>
                <View style={styles.courseInfo}>
                  <Text style={[styles.courseName, { color: theme.colors.text }]}>{course.name}</Text>
                  <Text style={[styles.courseDetails, { color: theme.colors.textSecondary }]}>
                    Grade: {course.grade} • Credits: {course.credits} • GPA: {course.gpaValue.toFixed(1)}
                  </Text>
                </View>
                <ThemedButton
                  type="error"
                  onPress={() => removeCourse(course.id)}
                >
                  <Text style={[styles.removeButtonText, { color: theme.colors.buttonText }]}>×</Text>
                </ThemedButton>
              </View>
            ))
          )}
        </View>

        {/* Grade Scale Reference */}
        <View style={[styles.gradeScaleSection, { 
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          borderWidth: 1,
        }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {gradingSystems[gradingSystem].name} Grade Scale
          </Text>
          <View style={styles.gradeScale}>
            {Object.entries(gradingSystems[gradingSystem].grades).map(([grade, value]) => (
              <View key={grade} style={styles.gradeItem}>
                <Text style={[styles.gradeText, { color: theme.colors.textSecondary }]}>{grade}: {value.toFixed(1)}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Grading System Modal */}
      <Modal
        visible={showGradingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGradingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { 
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.cardBorder,
            borderWidth: 1,
          }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Grading System</Text>
            {Object.entries(gradingSystems).map(([key, system]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.gradingOption,
                  { backgroundColor: theme.colors.surface },
                  gradingSystem === key && { backgroundColor: theme.colors.primary }
                ]}
                onPress={() => {
                  setGradingSystem(key);
                  setShowGradingModal(false);
                }}
              >
                <Text style={[
                  styles.gradingOptionText,
                  { color: gradingSystem === key ? theme.colors.buttonText : theme.colors.text }
                ]}>
                  {system.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: theme.colors.error }]}
              onPress={() => setShowGradingModal(false)}
            >
              <Text style={[styles.modalCloseButtonText, { color: theme.colors.buttonText }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Target GPA Modal */}
      <Modal
        visible={showTargetModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTargetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { 
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.cardBorder,
            borderWidth: 1,
          }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Target GPA Calculator</Text>
            
            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: theme.colors.input,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.text,
              }]}
              placeholder="Target GPA (e.g., 3.5)"
              value={targetGPA}
              onChangeText={setTargetGPA}
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textSecondary}
            />
            
            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: theme.colors.input,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.text,
              }]}
              placeholder="Additional Credits"
              value={targetCredits}
              onChangeText={setTargetCredits}
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textSecondary}
            />
            
            <View style={styles.modalButtons}>
              <ThemedButton
                type="success"
                onPress={calculateTargetGPA}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.buttonText }]}>Calculate</Text>
              </ThemedButton>
              <ThemedButton
                type="error"
                onPress={() => {
                  setTargetGPA('');
                  setTargetCredits('');
                  setShowTargetModal(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.buttonText }]}>Cancel</Text>
              </ThemedButton>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Semester Modal */}
      <Modal
        visible={showSemesterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSemesterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { 
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.cardBorder,
            borderWidth: 1,
          }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Add New Semester</Text>
            
            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: theme.colors.input,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.text,
              }]}
              placeholder="Semester Name (e.g., Spring 2025)"
              value={newSemesterName}
              onChangeText={setNewSemesterName}
              placeholderTextColor={theme.colors.textSecondary}
            />
            
            <View style={styles.modalButtons}>
              <ThemedButton
                type="success"
                onPress={addSemester}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.buttonText }]}>Add</Text>
              </ThemedButton>
              <ThemedButton
                type="error"
                onPress={() => {
                  setNewSemesterName('');
                  setShowSemesterModal(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.buttonText }]}>Cancel</Text>
              </ThemedButton>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Semester Modal */}
      <Modal
        visible={showEditSemesterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditSemesterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, borderWidth: 1 }]}> 
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Edit Semester</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.colors.input, borderColor: theme.colors.inputBorder, color: theme.colors.text }]}
              value={editingSemesterName}
              onChangeText={setEditingSemesterName}
              placeholder="Semester Name"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <View style={styles.modalButtons}>
              <ThemedButton
                type="success"
                onPress={() => {
                  const updated = [...semesters];
                  updated[editingSemesterIndex].name = editingSemesterName.trim() || updated[editingSemesterIndex].name;
                  setSemesters(updated);
                  setShowEditSemesterModal(false);
                }}
              >
                Save
              </ThemedButton>
              <ThemedButton
                type="error"
                onPress={() => {
                  deleteSemester(editingSemesterIndex);
                  setShowEditSemesterModal(false);
                }}
              >
                Delete
              </ThemedButton>
              <ThemedButton
                type="secondary"
                onPress={() => setShowEditSemesterModal(false)}
              >
                Cancel
              </ThemedButton>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  overallGpaSection: {
    marginBottom: 20,
  },
  gpaCard: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  gpaLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  gpaValue: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  creditsText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  semesterNav: {
    marginBottom: 15,
  },
  semesterTab: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  semesterTabActive: {
    backgroundColor: '#4CAF50',
  },
  semesterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  semesterTabTextActive: {
    color: 'white',
  },
  semesterGpaText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  addSemesterTab: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSemesterText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  currentSemesterGpa: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  currentSemesterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  inputSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  coursesSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  courseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  courseDetails: {
    fontSize: 14,
    color: '#666',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gradeScaleSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  gradeScale: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gradeItem: {
    width: '48%',
    marginBottom: 8,
  },
  gradeText: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  gradingOption: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  gradingOptionSelected: {
    backgroundColor: '#2196F3',
  },
  gradingOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  gradingOptionTextSelected: {
    color: 'white',
  },
  modalCloseButton: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

AppRegistry.registerComponent('main', () => App);

export default App;
