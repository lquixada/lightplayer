# coding: utf-8
from setuptools import setup, find_packages

setup(
    name = 'lightplayer',
    version = '0.0.2',
    description = u'Lightbox de videos ds projetos de Entretenimento'.encode('utf-8'),
    author = 'Entretenimento',
    author_email = 'entretenimento@corp.globo.com',
    url = 'http://ngit.globoi.com/lightbox',
    packages = find_packages(),
    zip_safe = False,
    include_package_data = True,
)
