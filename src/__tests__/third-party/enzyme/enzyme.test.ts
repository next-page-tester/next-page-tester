import { getPage } from '../../../index';
import { mount } from 'enzyme';

describe('enzyme', () => {
  test('As a user I can combine "enzyme" and "next-page-tester"', async () => {
    const { page } = await getPage({
      nextRoot: __dirname,
      route: '/a',
    });

    const wrapper = mount(page);

    expect(wrapper.find('span').text()).toEqual('Count: 0');
    wrapper.find('button').simulate('click');
    expect(wrapper.find('span').text()).toEqual('Count: 1');
  });
});
