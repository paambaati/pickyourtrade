import { shallowMount, createLocalVue } from '@vue/test-utils';
import Login from '../../src/components/Login';
import Vuex from 'vuex';

// Component tests.
// This is to illustrate testing Vue components.
describe('✨Login.test.js', () => {
    const localVue = createLocalVue();
    let component;

    beforeEach(() => {
        component = shallowMount(Login, {
            localVue,
            data() {
                return {
                    username: 'test1',
                    password: 'pass1',
                    isLoggingIn: false,
                    loginFailed: false,
                };
            },
        });
    });

    test('renders correctly', () => {
        const wrapper = shallowMount(Login);
        expect(wrapper.element).toMatchSnapshot();
    });

    test('sets data correctly', () => {
        expect(component.vm.username).toEqual('test1');
        expect(component.vm.password).toEqual('pass1');
        expect(component.vm.isLoggingIn).toEqual(false);
        expect(component.vm.loginFailed).toEqual(false);
    });

    test('submitting the login form triggers the login action', () => {
        const loginMock = jest.fn(() => Promise.resolve());
        localVue.use(Vuex);
        const store = new Vuex.Store({
            actions: {
                login: loginMock,
            },
        });
        const wrapper = shallowMount(Login, { localVue, store });
        wrapper.find('form').trigger('submit');
        expect(loginMock).toHaveBeenCalled();
    });
});
