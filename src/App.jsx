import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Fragment, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import useUserStore from './store/userStore';
import DashboardPage from './features/dashboard/DashboardPage';
import DiscoverPage from './features/discover/DiscoverPage';
import ProfilePage from './features/profile/ProfilePage';
import SettingsPage from './features/settings/SettingsPage';
import AuthModal from './features/auth/AuthModal';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Discover', href: '/discover' }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function App() {
  const { user, logout } = useUserStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Disclosure as="nav" className="bg-white shadow">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      <img
                        className="h-8 w-auto"
                        src="/logo.png"
                        alt="MediaMatch"
                      />
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    {user ? (
                      <Menu as="div" className="ml-3 relative">
                        <div>
                          <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={user.avatar}
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/profile"
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  Your Profile
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/settings"
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  Settings
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={logout}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block w-full text-left px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  Sign out
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    ) : (
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Sign in
                      </button>
                    )}
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden">
                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="pt-2 pb-3 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                {user ? (
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="flex items-center px-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar}
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">
                          {user.name}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="space-y-1">
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <main>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/watchlist" element={<ProfilePage />} />
          </Routes>
        </main>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </Router>
  );
}

export default App;
