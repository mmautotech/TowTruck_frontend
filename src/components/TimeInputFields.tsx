import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { wp, hp } from '../utils/responsive';

type Props = {
  days: string;
  hours: string;
  minutes: string;
  onChangeDays: (v: string) => void;
  onChangeHours: (v: string) => void;
  onChangeMinutes: (v: string) => void;
};

const TimeInputFields: React.FC<Props> = ({
  days,
  hours,
  minutes,
  onChangeDays,
  onChangeHours,
  onChangeMinutes,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.inputBox}>
        <Text style={styles.label} allowFontScaling={false}>Days</Text>
        <TextInput
          value={days}
          onChangeText={onChangeDays}
          style={styles.input}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#999"
          allowFontScaling={false}
        />
      </View>
      <View style={styles.inputBox}>
        <Text style={styles.label} allowFontScaling={false}>Hours</Text>
        <TextInput
          value={hours}
          onChangeText={onChangeHours}
          style={styles.input}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#999"
          allowFontScaling={false}
        />
      </View>
      <View style={styles.inputBox}>
        <Text style={styles.label} allowFontScaling={false}>Minutes</Text>
        <TextInput
          value={minutes}
          onChangeText={onChangeMinutes}
          style={styles.input}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#999"
          allowFontScaling={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(3),
    marginVertical: hp(1.5),
  },
  inputBox: {
    flex: 1,
  },
  label: {
    fontSize: wp(3.5),
    marginBottom: hp(0.5),
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(2),
    padding: wp(2),
    fontSize: wp(4),
    textAlign: 'center',
    color: '#000',
    backgroundColor: '#fff',
  },
});

export default TimeInputFields;
