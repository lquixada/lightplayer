# coding: utf-8
from setuptools import setup, find_packages

setup(
    name = 'lightbox',
    version = '1.0.0',
    description = u'App de lightbox de videos ds projetos de Entretenimento'.encode('utf-8'),
    author = 'Entretenimento',
    author_email = 'entretenimento@corp.globo.com',
    url = 'http://ngit.globoi.com/lightbox',
    packages = find_packages(),
    zip_safe = False,
    include_package_data = True,
)
