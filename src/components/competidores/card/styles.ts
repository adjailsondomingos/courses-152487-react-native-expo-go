import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: 100,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E3E3E3',
    borderWidth: 1,
    paddingLeft: 5,
    marginBottom: 4,
    borderRadius: 10
  },
  content: {
    flex: 1,
    padding: 5,
  },
  nome: {
    fontSize: 15,
    lineHeight: 18,
    color: '#3D434D',
    fontWeight: 'bold',
  },
  email: {
    fontSize: 15,
    lineHeight: 18,
    color: '#3D434D',
    fontWeight: 'normal',
  },
  ender: {
    color: '#888D97',
    fontSize: 13,
  },
  user: {
    color: '#888D97',
    fontSize: 13,
  },
  password: {
    color: '#1967FB',
    fontSize: 15,
    fontWeight: 'bold',
  },
  button: {
    height: 80,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E3E3E3',
  }
});
